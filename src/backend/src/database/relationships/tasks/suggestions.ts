import { Task } from "./index.js";
import { createMatchMessage, findSuggestionsForUser } from "../match.js";
import { RelationshipModel } from "../../user/relationship.js";
import { StreamChatClient } from "../../../getstream.io/index.js";
import { UserModel } from "../../user/user.js";
import { getMessaging } from "firebase-admin/messaging";
import { getEnvironmentVariables } from "../../../utils.js";

const { ADMIN_ID } = getEnvironmentVariables("ADMIN_ID");

export class SuggestionTask extends Task {
  constructor(uid: string) {
    super(uid);
  }

  async execute(): Promise<any> {
    const suggestionsResult = await findSuggestionsForUser(this.uid);
    const suggestionsArray = suggestionsResult.map((s) => s.uid);

    await RelationshipModel.updateOne(
      { uid: this.uid },
      { $set: { suggestions: suggestionsArray } }
    );

    return suggestionsArray;
  }
}

export class LikeTask extends Task {
  private liked: string;
  constructor(liker: string, liked: string) {
    super(liker);
    this.liked = liked;
  }

  async execute(): Promise<any> {
    return RelationshipModel.updateOne(
      { uid: this.uid },
      { $addToSet: { likes: this.liked } }
    );
  }
}

export class DislikeTask extends Task {
  private disliked: string;
  constructor(disliker: string, liked: string) {
    super(disliker);
    this.disliked = liked;
  }

  async execute(): Promise<any> {
    return RelationshipModel.updateOne(
      { uid: this.uid },
      { $addToSet: { dislikes: this.disliked } }
    );
  }
}

export class CheckForMatchTask extends Task {
  private uid2: string;

  constructor(uid: string, uid2: string) {
    super(uid);
    this.uid2 = uid2;
  }

  async execute(): Promise<any> {
    const [relationships, users] = await Promise.all([
      RelationshipModel.find({ uid: { $in: [this.uid, this.uid2] } }).exec(),
      UserModel.find(
        { uid: { $in: [this.uid, this.uid2] } },
        { uid: 1, notificationToken: 1, firstName: 1 }
      ).exec(),
    ]);

    const rForUser1 = relationships.find((u) => u.uid === this.uid);
    const rForUser2 = relationships.find((u) => u.uid === this.uid2);

    const user1LikesUser2 = rForUser1?.likes.includes(this.uid2);
    const user2LikesUser1 = rForUser2?.likes.includes(this.uid);

    if (!user1LikesUser2 || !user2LikesUser1) return;

    await RelationshipModel.bulkWrite([
      {
        updateOne: {
          filter: { uid: this.uid },
          update: { $addToSet: { matches: this.uid2 }, $pull: { likes: this.uid2 } },
        },
      },
      {
        updateOne: {
          filter: { uid: this.uid2 },
          update: { $addToSet: { matches: this.uid }, $pull: { likes: this.uid } },
        },
      },
    ]);

    // Providing no ID here will cause an error due to the following issue: https://github.com/GetStream/stream-chat-js/issues/1098
    // For now we just create an ID by combing the UIDs
    const channel = StreamChatClient.channel("messaging", `${this.uid}${this.uid2}`, {
      members: [this.uid, this.uid2],
      created_by_id: ADMIN_ID,
    });

    await channel.create();

    const user1 = users.find((u) => u.uid === this.uid);
    const user2 = users.find((u) => u.uid === this.uid2);

    if (!user1 || !user2) {
      throw new Error(`failed to fetch users with ids: ${this.uid}, ${this.uid2}`);
    }

    const messages = [createMatchMessage(user1, user2), createMatchMessage(user2, user1)];

    return getMessaging().sendEach(messages);
  }
}

export class UnmatchTask extends Task {
  private uid2: string;

  constructor(uid: string, uid2: string) {
    super(uid);
    this.uid2 = uid2;
  }

  async execute(): Promise<any> {
    const channels = await StreamChatClient.queryChannels({
      $and: [{ members: { $in: [this.uid] } }, { members: { $in: [this.uid2] } }],
    });

    await StreamChatClient.deleteChannels(channels.map((c) => c.cid ?? ""));

    // TODO: Think about if we should also remove them from the likes array or not, in case you want to match again...
    return RelationshipModel.bulkWrite([
      {
        updateOne: {
          filter: { uid: this.uid },
          update: { $pull: { matches: this.uid2 } },
        },
      },
      {
        updateOne: {
          filter: { uid: this.uid2 },
          update: { $pull: { matches: this.uid } },
        },
      },
    ]);
  }
}

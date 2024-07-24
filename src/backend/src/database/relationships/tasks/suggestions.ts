import { Task } from "./index.js";
import { findSuggestionsForUser } from "../match.js";
import { RelationshipModel } from "../../user/relationship.js";
import { ADMIN_ID, StreamChatClient } from "../../../getstream.io/index.js";

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
    const [user1, user2] = await Promise.all([
      RelationshipModel.findOne({ uid: this.uid }).exec(),
      RelationshipModel.findOne({ uid: this.uid2 }).exec(),
    ]);

    const user1LikesUser2 = user1?.likes.includes(this.uid2);
    const user2LikesUser1 = user2?.likes.includes(this.uid);

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

    return channel.create();
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

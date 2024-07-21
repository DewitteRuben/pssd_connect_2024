import { Task } from "./index.js";
import { findSuggestionsForUser } from "../match.js";
import { RelationshipModel } from "../../user/relationship.js";

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

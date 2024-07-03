import { Task } from ".";
import { RelationshipModel } from "../../user/user";
import { findSuggestionsForUser } from "../match";

class SuggestionTask extends Task {
  constructor(uid: string) {
    super(uid);
  }

  async execute(): Promise<void> {
    const suggestions = await findSuggestionsForUser(this.uid);
    await RelationshipModel.updateOne({ uid: this.uid }, { $set: { suggestions } });

    return;
  }
}

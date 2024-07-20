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

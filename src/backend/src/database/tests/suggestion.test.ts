import { findSuggestionForUser } from "../match/match";
import { MongoDB } from "../mongo";
import { UserModel } from "../user/user";
import { mockUser1, mockUsers } from "./mock.data";

describe("insert", () => {
  beforeAll(async () => {
    await MongoDB.connect();

    for (const user of mockUsers) {
      await UserModel.create(user);
    }
  });

  afterAll(async () => {
    for (const user of mockUsers) {
      await UserModel.deleteOne({ uid: user.uid });
    }

    await MongoDB.disconnect();
  });

  it("should find suggestions", async () => {
    let suggestions;

    // generic match
    suggestions = await findSuggestionForUser(mockUser1.uid);
    expect(suggestions.find((s) => s.uid === "2")).toBeDefined();

    await UserModel.updateOne({ uid: mockUser1.uid }, { $set: { preferences: {}} });
  });
});

import { findSuggestionsForUser } from "../relationships/match";
import { MongoDB } from "../mongo";
import { UserModel } from "../user/user";
import { mockUser1, mockUser2, mockUsers } from "./mock.data";
import { differenceInYears } from "date-fns";
import { RelationshipModel } from "../user/relationship";
import { calculateDistance } from "../../routes/helpers";

describe("insert", () => {
  beforeAll(async () => {
    await MongoDB.connect();

    for (const user of mockUsers) {
      await UserModel.create(user);
    }
  });

  afterAll(async () => {
    for (const user of mockUsers) {
      await UserModel.deleteMany({ uid: user.uid });
      await RelationshipModel.deleteMany({ uid: user.uid });
    }

    await MongoDB.disconnect();
  });

  // Reset data before each test
  afterEach(async () => {
    for (const user of mockUsers) {
      await UserModel.updateOne({ uid: user.uid }, { $set: user });
      await RelationshipModel.updateOne(
        { uid: user.uid },
        {
          $set: {
            dislikes: [],
            likes: [],
            matches: [],
            suggestions: [],
            suggestions_info: [],
          },
        }
      );
    }
  });

  it("should find suggestions", async () => {
    let suggestions;

    // generic match
    suggestions = await findSuggestionsForUser(mockUser1.uid);
    expect(suggestions.find((s) => s.uid === "2")).toBeDefined();
  });

  it("should return no suggestions if all users are excluded", async () => {
    // Simulate a case where user1 has already liked/disliked all other users
    const allMockUsers = mockUsers.map((u) => u.uid);
    const allOtherMockUsers = allMockUsers.filter((uid) => uid !== mockUser1.uid);

    await RelationshipModel.updateOne(
      { uid: mockUser1.uid },
      { $set: { likes: allOtherMockUsers } }
    );

    const suggestions = await findSuggestionsForUser(mockUser1.uid);

    // filter out non-mock users
    expect(suggestions.filter((s) => allMockUsers.includes(s.uid)).length).toBe(0);
  });

  it("should take into account my own max distance", async () => {
    // Test that users with global: false only see nearby users within their maxDistance

    await UserModel.updateOne(
      { uid: mockUser1.uid },
      {
        $set: {
          preferences: { ...mockUser1.preferences, global: false, maxDistance: 60 },
        },
      }
    );

    const suggestions = await findSuggestionsForUser(mockUser1.uid);

    suggestions.forEach(({ location }) => {
      const distance = calculateDistance(
        mockUser1.location.coordinates[0],
        mockUser1.location.coordinates[1],
        location.coordinates[0],
        location.coordinates[1]
      );

      expect(distance).toBeLessThanOrEqual(60);
    });

    // should only match with mockUser2
    expect(suggestions.length).toBe(1);
  });

  it("should take into account the other's max distance if I'm global", async () => {
    // Test that users with global: false only see nearby users within their maxDistance

    await UserModel.updateOne(
      { uid: mockUser1.uid },
      {
        $set: {
          preferences: { ...mockUser1.preferences, global: true },
        },
      }
    );

    await UserModel.updateOne(
      { uid: mockUser2.uid },
      {
        $set: {
          preferences: { ...mockUser2.preferences, global: false, maxDistance: 20 },
        },
      }
    );

    const suggestions = await findSuggestionsForUser(mockUser1.uid);

    expect(suggestions.length).toBe(1);
    // Should no longer match with user2
    expect(suggestions.find((s) => s.uid === "10")).toBeDefined();
  });

  it("should filter suggestions based on age preferences", async () => {
    // Ensure suggestions are within the age range
    await UserModel.updateOne(
      { uid: mockUser1.uid },
      { $set: { preferences: { ...mockUser1.preferences, ageStart: 25, ageEnd: 50 } } }
    );

    const suggestions = await findSuggestionsForUser(mockUser1.uid);
    expect(
      suggestions.every((s) => {
        const age = differenceInYears(new Date(), new Date(s.birthdate));

        return age >= 25 && age <= 50;
      })
    ).toBe(true);
  });
});

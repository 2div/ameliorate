/* eslint-disable functional/no-let -- let is needed to reuse `before`-initialized variables across tests */
import { Topic, User } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { beforeEach, describe, expect, test } from "vitest";

import { xprisma } from "../../db/extendedPrisma";
import { appRouter } from "./_app";

let userWithTopics: User;
let otherUser: User;
let publicTopic: Topic;
let unlistedTopic: Topic;
let privateTopic: Topic;
let topicWithoutAllowAnyEdit: Topic;
let topicWithAllowAnyEdit: Topic;

beforeEach(async () => {
  userWithTopics = await xprisma.user.create({
    data: { username: "hasTopicsName", authId: "hasTopicsAuth" },
  });
  otherUser = await xprisma.user.create({
    data: { username: "otherUser", authId: "otherUser" },
  });
  publicTopic = await xprisma.topic.create({
    data: {
      title: "publicTopic",
      creatorName: userWithTopics.username,
      visibility: "public",
    },
  });

  unlistedTopic = await xprisma.topic.create({
    data: {
      title: "unlistedTopic",
      creatorName: userWithTopics.username,
      visibility: "unlisted",
    },
  });

  privateTopic = await xprisma.topic.create({
    data: {
      title: "privateTopic",
      creatorName: userWithTopics.username,
      visibility: "private",
    },
  });

  topicWithoutAllowAnyEdit = await xprisma.topic.create({
    data: {
      title: "topicWithoutAllowAnyEdit",
      creatorName: userWithTopics.username,
      visibility: "public",
      allowAnyoneToEdit: false,
    },
  });

  topicWithAllowAnyEdit = await xprisma.topic.create({
    data: {
      title: "topicWithAllowAnyEdit",
      creatorName: userWithTopics.username,
      visibility: "public",
      allowAnyoneToEdit: true,
    },
  });
});

describe("find", () => {
  describe("when viewing your own topics", () => {
    test("can view private topic", async () => {
      const trpc = appRouter.createCaller({
        userAuthId: userWithTopics.authId,
        userEmailVerified: true,
        user: userWithTopics,
      });

      const topic = await trpc.topic.find({ id: privateTopic.id });

      expect(topic).toStrictEqual(privateTopic);
    });
  });

  describe("when viewing someone else's topics", () => {
    test("can view public topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.find({ id: publicTopic.id });

      expect(topic).toStrictEqual(publicTopic);
    });

    test("can view unlisted topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.find({ id: unlistedTopic.id });

      expect(topic).toStrictEqual(unlistedTopic);
    });

    test("cannot view private topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.find({ id: privateTopic.id });

      expect(topic).not.toStrictEqual(privateTopic);
    });
  });
});

describe("findByUsernameAndTitle", () => {
  describe("when viewing your own topic", () => {
    test("can view private topic", async () => {
      const trpc = appRouter.createCaller({
        userAuthId: userWithTopics.authId,
        userEmailVerified: true,
        user: userWithTopics,
      });

      const topic = await trpc.topic.findByUsernameAndTitle({
        username: userWithTopics.username,
        title: privateTopic.title,
      });

      expect(topic).toStrictEqual(privateTopic);
    });
  });

  describe("when viewing someone else's topic", () => {
    test("can view public topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.findByUsernameAndTitle({
        username: userWithTopics.username,
        title: publicTopic.title,
      });

      expect(topic).toStrictEqual(publicTopic);
    });

    test("can view unlisted topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.findByUsernameAndTitle({
        username: userWithTopics.username,
        title: unlistedTopic.title,
      });

      expect(topic).toStrictEqual(unlistedTopic);
    });

    test("cannot view private topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.findByUsernameAndTitle({
        username: userWithTopics.username,
        title: privateTopic.title,
      });

      expect(topic).toBeNull();
    });
  });
});

describe("getData", () => {
  describe("when viewing your own topic", () => {
    test("can view private topic", async () => {
      const trpc = appRouter.createCaller({
        userAuthId: userWithTopics.authId,
        userEmailVerified: true,
        user: userWithTopics,
      });

      const topic = await trpc.topic.getData({
        username: userWithTopics.username,
        title: privateTopic.title,
      });

      expect(topic?.id).toBe(privateTopic.id);
    });
  });

  describe("when viewing someone else's topic", () => {
    test("can view public topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.getData({
        username: userWithTopics.username,
        title: publicTopic.title,
      });

      expect(topic?.id).toBe(publicTopic.id);
    });

    test("can view unlisted topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.getData({
        username: userWithTopics.username,
        title: unlistedTopic.title,
      });

      expect(topic?.id).toBe(unlistedTopic.id);
    });

    test("cannot view private topic", async () => {
      const trpc = appRouter.createCaller({});

      const topic = await trpc.topic.getData({
        username: userWithTopics.username,
        title: privateTopic.title,
      });

      expect(topic).toBeNull();
    });
  });
});

describe("setData", () => {
  const tryUpdateTopic = async (loggedInUser: User | null, topic: Topic) => {
    const trpc = appRouter.createCaller(
      loggedInUser
        ? {
            userAuthId: loggedInUser.authId,
            userEmailVerified: true,
            user: loggedInUser,
          }
        : {}
    );

    await trpc.topic.setData({
      topicId: topic.id,
      nodesToCreate: [
        {
          type: "problem",
          id: uuid(),
          text: "yep",
          topicId: topic.id,
          arguedDiagramPartId: null,
          customType: null,
          notes: "",
        },
      ],
      nodesToUpdate: [],
      nodesToDelete: [],
      edgesToCreate: [],
      edgesToUpdate: [],
      edgesToDelete: [],
      scoresToCreate: [],
      scoresToUpdate: [],
      scoresToDelete: [],
    });
  };

  describe("when user is creator", () => {
    test("can update topic", async () => {
      await expect(tryUpdateTopic(userWithTopics, topicWithoutAllowAnyEdit)).resolves.not.toThrow();
    });
  });

  describe("when user is logged in, but not creator", () => {
    describe("when topic allows edit by anyone", () => {
      test("can update topic", async () => {
        await expect(tryUpdateTopic(otherUser, topicWithAllowAnyEdit)).resolves.not.toThrow();
      });
    });

    describe("when topic does not allow edit by anyone", () => {
      test("cannot update topic", async () => {
        await expect(tryUpdateTopic(otherUser, topicWithoutAllowAnyEdit)).rejects.toThrow();
      });
    });
  });

  describe("when user is not logged in", () => {
    test("cannot update topic", async () => {
      await expect(tryUpdateTopic(null, topicWithAllowAnyEdit)).rejects.toThrow();
    });
  });
});

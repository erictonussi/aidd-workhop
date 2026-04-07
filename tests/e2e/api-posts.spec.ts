/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

// Type definitions for API responses
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  author: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

test.describe("/posts API endpoints", () => {
  test.beforeEach(async ({ page }) => {
    // Set up common request headers
    await page.setExtraHTTPHeaders({
      "Content-Type": "application/json",
    });
  });

  test.describe("GET /api/posts", () => {
    test("should list all posts with default pagination", async ({ page }) => {
      const response = await page.request.get("/api/posts");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.error).toBe(false);
      expect(data.statusMessage).toBe("Retrieved posts successfully");
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toMatchObject({
        page: 1,
        limit: 20,
        total: expect.any(Number),
      });
    });

    test("should filter posts by status", async ({ page }) => {
      const response = await page.request.get("/api/posts?status=published");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.every((post: any) => post.status === "published")).toBe(
        true
      );
    });

    test("should filter posts by draft status", async ({ page }) => {
      const response = await page.request.get("/api/posts?status=draft");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.every((post: any) => post.status === "draft")).toBe(
        true
      );
    });

    test("should search posts by title and content", async ({ page }) => {
      const response = await page.request.get("/api/posts?search=TypeScript");
      const data = await response.json();

      expect(response.status()).toBe(200);
      if (data.data.length > 0) {
        expect(
          data.data.some(
            (post: any) =>
              post.title.includes("TypeScript") ||
              post.content.includes("TypeScript") ||
              post.description?.includes("TypeScript")
          )
        ).toBe(true);
      }
    });

    test("should filter posts by author", async ({ page }) => {
      const response = await page.request.get("/api/posts?author=Alex");
      const data = await response.json();

      expect(response.status()).toBe(200);
      if (data.data.length > 0) {
        expect(
          data.data.every((post: any) => post.author.includes("Alex"))
        ).toBe(true);
      }
    });

    test("should paginate results correctly", async ({ page }) => {
      const response = await page.request.get("/api/posts?page=1&limit=2");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(2);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(2);
    });

    test("should sort posts by creation date desc by default", async ({
      page,
    }) => {
      const response = await page.request.get("/api/posts?limit=5");
      const data = await response.json();

      expect(response.status()).toBe(200);
      if (data.data.length > 1) {
        const dates = data.data.map((post: any) =>
          new Date(post.created_at).getTime()
        );
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
      }
    });

    test("should sort posts by title ascending", async ({ page }) => {
      const response = await page.request.get(
        "/api/posts?sortBy=title&sortOrder=asc&limit=5"
      );
      const data = await response.json();

      expect(response.status()).toBe(200);
      if (data.data.length > 1) {
        const titles = data.data.map((post: any) => post.title);
        const sortedTitles = [...titles].sort();
        expect(titles).toEqual(sortedTitles);
      }
    });

    test("should return empty results for non-existent search", async ({
      page,
    }) => {
      const response = await page.request.get(
        "/api/posts?search=NonExistentSearchTerm12345"
      );
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });
  });

  test.describe("POST /api/posts", () => {
    test("should create a new post successfully", async ({ page }) => {
      const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const newPost = {
        title: `Test Post Creation ${uniqueSuffix}`,
        content: "This is a test post created via API testing.",
        description: "Test post description",
        author: "Test Author",
        status: "draft",
      };

      const response = await page.request.post("/api/posts", {
        data: newPost,
      });
      const data = await response.json();

      expect(response.status()).toBe(201);
      expect(data.error).toBe(false);
      expect(data.statusMessage).toBe("Post created successfully");
      expect(data.data).toMatchObject({
        id: expect.any(Number),
        title: newPost.title,
        slug: expect.stringContaining("test-post-creation"),
        content: newPost.content,
        description: newPost.description,
        author: newPost.author,
        status: "draft",
        published_at: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      await page.request.delete(`/api/posts/${data.data.id}`);
    });

    test("should auto-generate slug when not provided", async ({ page }) => {
      const newPost = {
        title: "My Amazing Blog Post Title!",
        content: "Content here",
        author: "Test Author",
      };

      const response = await page.request.post("/api/posts", {
        data: newPost,
      });
      const data = await response.json();

      expect(response.status()).toBe(201);
      expect(data.data.slug).toBe("my-amazing-blog-post-title");

      // Clean up
      await page.request.delete(`/api/posts/${data.data.id}`);
    });

    test("should create published post with published_at timestamp", async ({
      page,
    }) => {
      const newPost = {
        title: "Published Test Post",
        content: "This post should be published immediately",
        author: "Test Author",
        status: "published",
      };

      const response = await page.request.post("/api/posts", {
        data: newPost,
      });
      const data = await response.json();

      expect(response.status()).toBe(201);
      expect(data.data.status).toBe("published");
      expect(data.data.published_at).not.toBeNull();
      expect(new Date(data.data.published_at)).toBeInstanceOf(Date);

      // Clean up
      await page.request.delete(`/api/posts/${data.data.id}`);
    });

    test("should validate required fields", async ({ page }) => {
      const invalidPost = {
        description: "Missing required fields",
      };

      const response = await page.request.post("/api/posts", {
        data: invalidPost,
      });
      const data = await response.json();

      expect(response.status()).toBe(422);
      expect(data.error).toBe(true);
      expect(data.statusMessage).toBe("Invalid request payload");
      expect(data.data.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["title"],
            message: expect.stringContaining("Required"),
          }),
          expect.objectContaining({
            path: ["content"],
            message: expect.stringContaining("Required"),
          }),
          expect.objectContaining({
            path: ["author"],
            message: expect.stringContaining("Required"),
          }),
        ])
      );
    });

    test("should validate field lengths", async ({ page }) => {
      const invalidPost = {
        title: "",
        content: "",
        author: "",
        description: "a".repeat(501), // Exceeds 500 char limit
      };

      const response = await page.request.post("/api/posts", {
        data: invalidPost,
      });
      const data = await response.json();

      expect(response.status()).toBe(422);
      expect(data.error).toBe(true);
      expect(data.data.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["description"],
            message: expect.stringContaining("500"),
          }),
        ])
      );
    });
  });

  test.describe("GET /api/posts/[id]", () => {
    test("should retrieve a specific post by ID", async ({ page }) => {
      // First, get a valid post ID from the list
      const listResponse = await page.request.get("/api/posts?limit=1");
      const listData = await listResponse.json();
      const postId = listData.data[0].id;

      const response = await page.request.get(`/api/posts/${postId}`);
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.error).toBe(false);
      expect(data.statusMessage).toBe("Post retrieved successfully");
      expect(data.data).toMatchObject({
        id: postId,
        title: expect.any(String),
        slug: expect.any(String),
        content: expect.any(String),
        author: expect.any(String),
        status: expect.stringMatching(/^(draft|published)$/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    test("should return 404 for non-existent post", async ({ page }) => {
      const response = await page.request.get("/api/posts/999999");
      const data = await response.json();

      expect(response.status()).toBe(404);
      expect(data.error).toBe(true);
      expect(data.statusMessage).toBe("Post not found");
    });

    test("should validate ID parameter", async ({ page }) => {
      const response = await page.request.get("/api/posts/invalid-id");

      // Should return error due to invalid ID format
      expect(response.status()).not.toBe(200);
    });
  });

  test.describe("PUT /api/posts/[id]", () => {
    let testPostId: number;

    test.beforeEach(async ({ page }) => {
      // Create a test post for updates
      const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const createResponse = await page.request.post("/api/posts", {
        data: {
          title: `Post to Update ${uniqueSuffix}`,
          content: "Original content",
          author: "Original Author",
          status: "draft",
        },
      });
      const createData = await createResponse.json();
      testPostId = createData.data.id;
    });

    test.afterEach(async ({ page }) => {
      // Clean up test post
      if (testPostId) {
        await page.request.delete(`/api/posts/${testPostId}`);
      }
    });

    test("should update post fields successfully", async ({ page }) => {
      const updateData = {
        title: "Updated Post Title",
        description: "Updated description",
        status: "published",
      };

      const response = await page.request.put(`/api/posts/${testPostId}`, {
        data: updateData,
      });
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.error).toBe(false);
      expect(data.statusMessage).toBe("Post updated successfully");
      expect(data.data).toMatchObject({
        id: testPostId,
        title: updateData.title,
        slug: "updated-post-title",
        description: updateData.description,
        status: "published",
        published_at: expect.any(String), // Should be set when status changes to published
        updated_at: expect.any(String),
      });
    });

    test("should perform partial updates", async ({ page }) => {
      const updateData = {
        title: "Only Title Updated",
      };

      const response = await page.request.put(`/api/posts/${testPostId}`, {
        data: updateData,
      });
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.title).toBe(updateData.title);
      expect(data.data.content).toBe("Original content"); // Should remain unchanged
      expect(data.data.author).toBe("Original Author"); // Should remain unchanged
    });

    test("should auto-generate slug when title is updated", async ({
      page,
    }) => {
      const updateData = {
        title: "New Title With Special Characters!",
      };

      const response = await page.request.put(`/api/posts/${testPostId}`, {
        data: updateData,
      });
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.slug).toBe("new-title-with-special-characters");
    });

    test("should handle publishing via status update", async ({ page }) => {
      const updateData = {
        status: "published",
      };

      const response = await page.request.put(`/api/posts/${testPostId}`, {
        data: updateData,
      });
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.status).toBe("published");
      expect(data.data.published_at).not.toBeNull();
    });

    test("should handle unpublishing via status update", async ({ page }) => {
      // First publish the post
      await page.request.put(`/api/posts/${testPostId}`, {
        data: { status: "published" },
      });

      // Then unpublish it
      const response = await page.request.put(`/api/posts/${testPostId}`, {
        data: { status: "draft" },
      });
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.status).toBe("draft");
      expect(data.data.published_at).toBeNull();
    });

    test("should return 404 for non-existent post", async ({ page }) => {
      const response = await page.request.put("/api/posts/999999", {
        data: { title: "Updated Title" },
      });
      const data = await response.json();

      expect(response.status()).toBe(404);
      expect(data.error).toBe(true);
      expect(data.statusMessage).toBe("Post not found");
    });

    test("should validate updated field lengths", async ({ page }) => {
      const updateData = {
        title: "a".repeat(256), // Exceeds 255 char limit
        description: "b".repeat(501), // Exceeds 500 char limit
      };

      const response = await page.request.put(`/api/posts/${testPostId}`, {
        data: updateData,
      });
      const data = await response.json();

      expect(response.status()).toBe(422);
      expect(data.error).toBe(true);
    });
  });

  test.describe("DELETE /api/posts/[id]", () => {
    let testPostId: number;

    test.beforeEach(async ({ page }) => {
      // Create a test post for deletion
      const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const createResponse = await page.request.post("/api/posts", {
        data: {
          title: `Post to Delete ${uniqueSuffix}`,
          content: "This post will be deleted",
          author: "Test Author",
        },
      });
      const createData = await createResponse.json();
      testPostId = createData.data.id;
    });

    test("should delete post successfully", async ({ page }) => {
      const response = await page.request.delete(`/api/posts/${testPostId}`);
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.error).toBe(false);
      expect(data.statusMessage).toBe("Post deleted successfully");
      expect(data.data).toMatchObject({
        id: testPostId,
        deleted: true,
      });

      // Verify post is actually deleted
      const getResponse = await page.request.get(`/api/posts/${testPostId}`);
      expect(getResponse.status()).toBe(404);
    });

    test("should return 404 for non-existent post", async ({ page }) => {
      const response = await page.request.delete("/api/posts/999999");
      const data = await response.json();

      expect(response.status()).toBe(404);
      expect(data.error).toBe(true);
      expect(data.statusMessage).toBe("Post not found");
    });

    test("should return 404 for already deleted post", async ({ page }) => {
      // Delete the post
      await page.request.delete(`/api/posts/${testPostId}`);

      // Try to delete it again
      const response = await page.request.delete(`/api/posts/${testPostId}`);
      const data = await response.json();

      expect(response.status()).toBe(404);
      expect(data.error).toBe(true);
      expect(data.statusMessage).toBe("Post not found");
    });
  });

  test.describe("API Response Format", () => {
    test("should return consistent response format for success cases", async ({
      page,
    }) => {
      const response = await page.request.get("/api/posts?limit=1");
      const data = await response.json();

      expect(data).toMatchObject({
        error: false,
        url: expect.any(String),
        statusMessage: expect.any(String),
        statusCode: 200,
        message: expect.any(String),
        data: expect.any(Array),
        pagination: expect.any(Object),
      });
    });

    test("should return consistent error format", async ({ page }) => {
      const response = await page.request.get("/api/posts/999999");
      const data = await response.json();

      expect(data).toMatchObject({
        error: true,
        url: expect.any(String),
        statusCode: 404,
        statusMessage: expect.any(String),
        message: expect.any(String),
      });
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle empty content gracefully", async ({ page }) => {
      const response = await page.request.get("/api/posts?search=");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(Array.isArray(data.data)).toBe(true);
    });

    test("should handle large page numbers", async ({ page }) => {
      const response = await page.request.get("/api/posts?page=1000&limit=10");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.page).toBe(1000);
    });

    test("should handle limit boundary values", async ({ page }) => {
      const response = await page.request.get("/api/posts?limit=1");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(1);
      expect(data.pagination.limit).toBe(1);
    });

    test("should handle maximum limit", async ({ page }) => {
      const response = await page.request.get("/api/posts?limit=100");
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data.pagination.limit).toBe(100);
    });
  });

});

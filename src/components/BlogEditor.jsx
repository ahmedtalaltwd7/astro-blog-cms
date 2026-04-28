import { useState, useEffect, useRef } from "preact/hooks";
import { marked } from "marked";

export default function BlogEditor() {
  const [filename, setFilename] = useState("new-post.md");
  const [title, setTitle] = useState("My Amazing Blog Post");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState(`# My Amazing Blog Post

Start writing your blog post here using **markdown** syntax.

## Features

- Easy to write
- Supports code blocks
- Rendered beautifully by Astro

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

Enjoy writing!`);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [filenameExists, setFilenameExists] = useState(false);
  const [filenameMessage, setFilenameMessage] = useState("");
  const [existingPosts, setExistingPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFilename, setOriginalFilename] = useState("");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef(null);

  // Check if a blog post with the given filename already exists
  const checkFilenameExists = async (filenameToCheck) => {
    if (!filenameToCheck.endsWith(".md")) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const slug = filenameToCheck.replace(".md", "");
    try {
      const response = await fetch(`/blog/${slug}`, { method: "HEAD" });
      if (response.ok) {
        setFilenameExists(true);
        setFilenameMessage(
          `⚠️ A blog post with filename "${filenameToCheck}" already exists. Saving will overwrite it.`,
        );
      } else {
        setFilenameExists(false);
        setFilenameMessage("");
      }
    } catch (error) {
      // Network error or page not found (404) - treat as not existing
      setFilenameExists(false);
      setFilenameMessage("");
    }
  };

  // Debounced effect to check filename existence when filename changes
  useEffect(() => {
    if (!filename) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const timer = setTimeout(() => {
      checkFilenameExists(filename);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [filename]);

  // Fetch existing posts on component mount
  useEffect(() => {
    fetchExistingPosts();
  }, []);

  const fetchExistingPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch("/api/list-posts");
      if (response.ok) {
        const data = await response.json();
        setExistingPosts(data.posts || []);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleEditPost = async (post) => {
    setFilename(post.filename);
    setTitle(post.title);
    // Set placeholder while loading
    setContent("Loading...");
    setIsEditing(true);
    setOriginalFilename(post.filename);
    setMessage(`Loading "${post.filename}"...`);
    try {
      const response = await fetch(
        `/api/get-post?filename=${encodeURIComponent(post.filename)}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }
      const data = await response.json();
      // data contains frontmatter and body
      const { frontmatter, body } = data;
      // Update title from frontmatter (may differ from post.title)
      setTitle(frontmatter.title || post.title);
      // Update image from frontmatter
      setImage(frontmatter.image || "");
      // Set content to the body (markdown without frontmatter)
      setContent(body.trim());
      // Clear image file and preview because we are not uploading a new image yet
      setImageFile(null);
      setImagePreview("");
      setMessage(`Loaded "${post.filename}". You can now edit the content.`);
    } catch (error) {
      console.error("Error loading post:", error);
      // Fallback to placeholder content
      setContent(
        `---\ntitle: "${post.title}"\npubDate: ${post.pubDate || new Date().toISOString().split("T")[0]}\ndescription: "${post.description}"\nauthor: "${post.author}"\ntags: [${post.tags.map((t) => `"${t}"`).join(", ")}]\n---\n\n[Failed to load full content. Please edit manually.]`,
      );
      setMessage(
        `Could not load full content for "${post.filename}". You may need to edit manually.`,
      );
    }
  };

  const handleDeletePost = async (filename) => {
    if (
      !confirm(
        `Are you sure you want to delete "${filename}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ Post "${filename}" deleted successfully.`);
        // Refresh the list
        fetchExistingPosts();
      } else {
        setMessage(`❌ Error deleting post: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error.message}`);
    }
  };

  const handleRefreshPosts = () => {
    fetchExistingPosts();
    setMessage("Refreshing post list...");
  };

  const handleSave = async () => {
    if (!filename.endsWith(".md")) {
      setMessage("Filename must end with .md");
      return;
    }
    setIsSaving(true);
    setMessage("Saving...");

    try {
      console.log("Saving post:", {
        filename,
        title,
        content: content.substring(0, 50) + "...",
        imageFile: imageFile ? imageFile.name : "none",
      });

      let imageBase64 = "";
      let imageFilename = "";
      if (imageFile) {
        // Convert image to base64 to avoid multipart/CORS issues
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // reader.result is "data:<mime>;base64,<data>" — extract just the base64 part
            const result = reader.result;
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        imageFilename = imageFile.name;
      }

      // Always use JSON (avoids multipart/CORS preflight issues)
      const response = await fetch("/api/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          title,
          content,
          image,
          imageBase64,
          imageFilename,
        }),
      });

      console.log("Response status:", response.status);
      // Safely parse response — it may not be JSON if a server error occurred
      let result;
      const responseText = await response.text();
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error("Non-JSON response:", responseText.substring(0, 200));
        setMessage(`❌ Server error: ${responseText.substring(0, 100)}`);
        return;
      }
      console.log("Response result:", result);
      if (response.ok) {
        setMessage(`✅ Post saved successfully as ${filename}`);
        // Clear form after successful save
        setFilename("");
        setTitle("");
        setContent("");
        setImage("");
        setImageFile(null);
        setImagePreview("");
        setIsEditing(false);
        setOriginalFilename("");
        // Refresh the list of posts
        fetchExistingPosts();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleClear = () => {
    setFilename("");
    setTitle("");
    setContent("");
    setMessage("");
    setImageFile(null);
    setImagePreview("");
  };

  const applyWrap = (before, after = before) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selected +
      after +
      content.substring(end);
    setContent(newText);
    requestAnimationFrame(() => {
      const pos = start + before.length + selected.length + after.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  const insertAtCursor = (text) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);
    setContent(newText);
    requestAnimationFrame(() => {
      const pos = start + text.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  const insertLink = () => {
    applyWrap("[", "](https://)");
  };

  const insertImageMarkdown = () => {
    insertAtCursor("![alt text](https://)");
  };

  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            Blog Editor Control Panel
          </h1>
          <p class="text-gray-600 mb-8">
            Create and edit markdown blog posts that will be saved to{" "}
            <code class="bg-gray-100 px-2 py-1 rounded">src/pages/blog/</code>
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Editor */}
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Create New Post
              </h2>

              {message && (
                <div
                  class={`mb-4 p-3 rounded ${message.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {message}
                </div>
              )}

              <div class="space-y-4">
                <div>
                  <label
                    for="filename"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Filename
                  </label>
                  <input
                    type="text"
                    id="filename"
                    name="filename"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="my-new-post.md"
                    value={filename}
                    onInput={(e) => setFilename(e.target.value)}
                  />
                  <p class="mt-1 text-sm text-gray-500">
                    File will be saved in src/pages/blog/
                  </p>
                  {filenameMessage && (
                    <div
                      class={`mt-2 p-2 rounded text-sm ${filenameExists ? "bg-yellow-50 text-yellow-800 border border-yellow-200" : "bg-blue-50 text-blue-800"}`}
                    >
                      {filenameMessage}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    for="image"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Featured Image (Optional)
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div class="mt-3">
                      <p class="text-sm text-gray-600 mb-1">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        class="max-w-full h-auto max-h-48 rounded border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label
                    for="title"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Post Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My Amazing Blog Post"
                    value={title}
                    onInput={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    for="content"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Markdown Content
                  </label>

                  <div class="mb-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyWrap("**")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => applyWrap("*")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => applyWrap("# ", "")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => applyWrap("\n\`\`\`\n", "\n\`\`\`\n")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      Code
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor("\n> ")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor("- ")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      UL
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAtCursor("1. ")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      OL
                    </button>
                    <button
                      type="button"
                      onClick={insertLink}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={insertImageMarkdown}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => applyWrap("\`", "\`")}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      Inline
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreview((p) => !p)}
                      class="px-2 py-1 text-sm border rounded"
                    >
                      {preview ? "Editor" : "Preview"}
                    </button>
                  </div>

                  {!preview ? (
                    <textarea
                      ref={textareaRef}
                      id="content"
                      name="content"
                      rows="15"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder="Write your blog post in markdown here..."
                      value={content}
                      onInput={(e) => setContent(e.target.value)}
                    />
                  ) : (
                    <div
                      class="prose max-w-none p-4 border border-gray-200 rounded bg-white overflow-auto"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(content || ""),
                      }}
                    />
                  )}
                </div>

                <div class="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      ></path>
                    </svg>
                    {isSaving ? "Saving..." : "Save Post"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/blog/${filename.replace(".md", "")}`,
                        "_blank",
                      )
                    }
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Preview
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Existing Posts */}
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Existing Blog Posts
              </h2>

              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-4">
                  <p class="text-gray-600">
                    Posts in{" "}
                    <code class="bg-gray-100 px-2 py-1 rounded">
                      src/pages/blog/
                    </code>
                    :
                  </p>
                  <button
                    type="button"
                    onClick={handleRefreshPosts}
                    class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    Refresh
                  </button>
                </div>

                {loadingPosts ? (
                  <div class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p class="mt-2 text-gray-500">Loading posts...</p>
                  </div>
                ) : existingPosts.length === 0 ? (
                  <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <p class="mt-2 text-sm text-gray-500">
                      No blog posts yet. Create your first post using the
                      editor.
                    </p>
                  </div>
                ) : (
                  <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {existingPosts.map((post) => (
                      <div
                        key={post.filename}
                        class="bg-white border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <h3 class="font-medium text-gray-900">
                              {post.filename}
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">
                              {post.title}
                            </p>
                            <div class="mt-2 flex flex-wrap gap-1">
                              {post.tags &&
                                post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                            <p class="text-xs text-gray-400 mt-2">
                              Published: {post.pubDate || "Unknown"}
                            </p>
                          </div>
                          <div class="flex space-x-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditPost(post)}
                              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.filename)}
                              class="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 class="font-medium text-blue-800">How it works</h3>
                  <ul class="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Write markdown in the editor</li>
                    <li>• Click "Save Post" to save to the blog directory</li>
                    <li>
                      • Posts will be automatically available at /blog/[slug]
                    </li>
                    <li>• Edit existing posts by clicking "Edit"</li>
                    <li>• Delete posts with the "Delete" button</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

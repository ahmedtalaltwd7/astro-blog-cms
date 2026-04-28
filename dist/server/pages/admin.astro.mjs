/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_z5fA6ZdE.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D9CNNVYF.mjs';
import { useState, useRef, useEffect } from 'preact/hooks';
import { marked } from 'marked';
import { jsx, jsxs } from 'preact/jsx-runtime';
export { renderers } from '../renderers.mjs';

function BlogEditor() {
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
  const checkFilenameExists = async (filenameToCheck) => {
    if (!filenameToCheck.endsWith(".md")) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const slug = filenameToCheck.replace(".md", "");
    try {
      const response = await fetch(`/blog/${slug}`, {
        method: "HEAD"
      });
      if (response.ok) {
        setFilenameExists(true);
        setFilenameMessage(`⚠️ A blog post with filename "${filenameToCheck}" already exists. Saving will overwrite it.`);
      } else {
        setFilenameExists(false);
        setFilenameMessage("");
      }
    } catch (error) {
      setFilenameExists(false);
      setFilenameMessage("");
    }
  };
  useEffect(() => {
    if (!filename) {
      setFilenameExists(false);
      setFilenameMessage("");
      return;
    }
    const timer = setTimeout(() => {
      checkFilenameExists(filename);
    }, 500);
    return () => clearTimeout(timer);
  }, [filename]);
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
    setContent("Loading...");
    setIsEditing(true);
    setOriginalFilename(post.filename);
    setMessage(`Loading "${post.filename}"...`);
    try {
      const response = await fetch(`/api/get-post?filename=${encodeURIComponent(post.filename)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }
      const data = await response.json();
      const {
        frontmatter,
        body
      } = data;
      setTitle(frontmatter.title || post.title);
      setImage(frontmatter.image || "");
      setContent(body.trim());
      setImageFile(null);
      setImagePreview("");
      setMessage(`Loaded "${post.filename}". You can now edit the content.`);
    } catch (error) {
      console.error("Error loading post:", error);
      setContent(`---
title: "${post.title}"
pubDate: ${post.pubDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
description: "${post.description}"
author: "${post.author}"
tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]
---

[Failed to load full content. Please edit manually.]`);
      setMessage(`Could not load full content for "${post.filename}". You may need to edit manually.`);
    }
  };
  const handleDeletePost = async (filename2) => {
    if (!confirm(`Are you sure you want to delete "${filename2}"? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: filename2
        })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ Post "${filename2}" deleted successfully.`);
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
        imageFile: imageFile ? imageFile.name : "none"
      });
      let imageBase64 = "";
      let imageFilename = "";
      if (imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result2 = reader.result;
            resolve(result2);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        imageFilename = imageFile.name;
      }
      const response = await fetch("/api/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename,
          title,
          content,
          image,
          imageBase64,
          imageFilename
        })
      });
      console.log("Response status:", response.status);
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
        setFilename("");
        setTitle("");
        setContent("");
        setImage("");
        setImageFile(null);
        setImagePreview("");
        setIsEditing(false);
        setOriginalFilename("");
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
    const newText = content.substring(0, start) + before + selected + after + content.substring(end);
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
  return jsx("div", {
    class: "min-h-screen bg-gray-50 py-8",
    children: jsx("div", {
      class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      children: jsxs("div", {
        class: "bg-white shadow rounded-lg p-6",
        children: [jsx("h1", {
          class: "text-3xl font-bold text-gray-900 mb-6",
          children: "Blog Editor Control Panel"
        }), jsxs("p", {
          class: "text-gray-600 mb-8",
          children: ["Create and edit markdown blog posts that will be saved to", " ", jsx("code", {
            class: "bg-gray-100 px-2 py-1 rounded",
            children: "src/pages/blog/"
          })]
        }), jsxs("div", {
          class: "grid grid-cols-1 lg:grid-cols-2 gap-8",
          children: [jsxs("div", {
            children: [jsx("h2", {
              class: "text-xl font-semibold text-gray-800 mb-4",
              children: "Create New Post"
            }), message && jsx("div", {
              class: `mb-4 p-3 rounded ${message.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`,
              children: message
            }), jsxs("div", {
              class: "space-y-4",
              children: [jsxs("div", {
                children: [jsx("label", {
                  for: "filename",
                  class: "block text-sm font-medium text-gray-700 mb-1",
                  children: "Filename"
                }), jsx("input", {
                  type: "text",
                  id: "filename",
                  name: "filename",
                  class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "my-new-post.md",
                  value: filename,
                  onInput: (e) => setFilename(e.target.value)
                }), jsx("p", {
                  class: "mt-1 text-sm text-gray-500",
                  children: "File will be saved in src/pages/blog/"
                }), filenameMessage && jsx("div", {
                  class: `mt-2 p-2 rounded text-sm ${filenameExists ? "bg-yellow-50 text-yellow-800 border border-yellow-200" : "bg-blue-50 text-blue-800"}`,
                  children: filenameMessage
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  for: "image",
                  class: "block text-sm font-medium text-gray-700 mb-1",
                  children: "Featured Image (Optional)"
                }), jsx("input", {
                  type: "file",
                  id: "image",
                  name: "image",
                  accept: "image/*",
                  class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                  onChange: handleImageChange
                }), imagePreview && jsxs("div", {
                  class: "mt-3",
                  children: [jsx("p", {
                    class: "text-sm text-gray-600 mb-1",
                    children: "Preview:"
                  }), jsx("img", {
                    src: imagePreview,
                    alt: "Preview",
                    class: "max-w-full h-auto max-h-48 rounded border border-gray-300"
                  })]
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  for: "title",
                  class: "block text-sm font-medium text-gray-700 mb-1",
                  children: "Post Title"
                }), jsx("input", {
                  type: "text",
                  id: "title",
                  name: "title",
                  class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                  placeholder: "My Amazing Blog Post",
                  value: title,
                  onInput: (e) => setTitle(e.target.value)
                })]
              }), jsxs("div", {
                children: [jsx("label", {
                  for: "content",
                  class: "block text-sm font-medium text-gray-700 mb-1",
                  children: "Markdown Content"
                }), jsxs("div", {
                  class: "mb-2 flex flex-wrap gap-2",
                  children: [jsx("button", {
                    type: "button",
                    onClick: () => applyWrap("**"),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "B"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => applyWrap("*"),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "I"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => applyWrap("# ", ""),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "H1"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => applyWrap("\n```\n", "\n```\n"),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "Code"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => insertAtCursor("\n> "),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "Quote"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => insertAtCursor("- "),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "UL"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => insertAtCursor("1. "),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "OL"
                  }), jsx("button", {
                    type: "button",
                    onClick: insertLink,
                    class: "px-2 py-1 text-sm border rounded",
                    children: "Link"
                  }), jsx("button", {
                    type: "button",
                    onClick: insertImageMarkdown,
                    class: "px-2 py-1 text-sm border rounded",
                    children: "Image"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => applyWrap("`", "`"),
                    class: "px-2 py-1 text-sm border rounded",
                    children: "Inline"
                  }), jsx("button", {
                    type: "button",
                    onClick: () => setPreview((p) => !p),
                    class: "px-2 py-1 text-sm border rounded",
                    children: preview ? "Editor" : "Preview"
                  })]
                }), !preview ? jsx("textarea", {
                  ref: textareaRef,
                  id: "content",
                  name: "content",
                  rows: "15",
                  class: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm",
                  placeholder: "Write your blog post in markdown here...",
                  value: content,
                  onInput: (e) => setContent(e.target.value)
                }) : jsx("div", {
                  class: "prose max-w-none p-4 border border-gray-200 rounded bg-white overflow-auto",
                  dangerouslySetInnerHTML: {
                    __html: marked.parse(content || "")
                  }
                })]
              }), jsxs("div", {
                class: "flex space-x-4",
                children: [jsxs("button", {
                  type: "button",
                  onClick: handleSave,
                  disabled: isSaving,
                  class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
                  children: [jsx("svg", {
                    class: "w-4 h-4 mr-2",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: jsx("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    })
                  }), isSaving ? "Saving..." : "Save Post"]
                }), jsx("button", {
                  type: "button",
                  onClick: () => window.open(`/blog/${filename.replace(".md", "")}`, "_blank"),
                  class: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  children: "Preview"
                }), jsx("button", {
                  type: "button",
                  onClick: handleClear,
                  class: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  children: "Clear"
                })]
              })]
            })]
          }), jsxs("div", {
            children: [jsx("h2", {
              class: "text-xl font-semibold text-gray-800 mb-4",
              children: "Existing Blog Posts"
            }), jsxs("div", {
              class: "bg-gray-50 rounded-lg p-4",
              children: [jsxs("div", {
                class: "flex justify-between items-center mb-4",
                children: [jsxs("p", {
                  class: "text-gray-600",
                  children: ["Posts in", " ", jsx("code", {
                    class: "bg-gray-100 px-2 py-1 rounded",
                    children: "src/pages/blog/"
                  }), ":"]
                }), jsxs("button", {
                  type: "button",
                  onClick: handleRefreshPosts,
                  class: "inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  children: [jsx("svg", {
                    class: "w-4 h-4 mr-1",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: jsx("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    })
                  }), "Refresh"]
                })]
              }), loadingPosts ? jsxs("div", {
                class: "text-center py-8",
                children: [jsx("div", {
                  class: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                }), jsx("p", {
                  class: "mt-2 text-gray-500",
                  children: "Loading posts..."
                })]
              }) : existingPosts.length === 0 ? jsxs("div", {
                class: "border-2 border-dashed border-gray-300 rounded-md p-6 text-center",
                children: [jsx("svg", {
                  class: "mx-auto h-12 w-12 text-gray-400",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: jsx("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  })
                }), jsx("p", {
                  class: "mt-2 text-sm text-gray-500",
                  children: "No blog posts yet. Create your first post using the editor."
                })]
              }) : jsx("div", {
                class: "space-y-3 max-h-[500px] overflow-y-auto pr-2",
                children: existingPosts.map((post) => jsx("div", {
                  class: "bg-white border border-gray-200 rounded-md p-4 hover:bg-gray-50",
                  children: jsxs("div", {
                    class: "flex justify-between items-start",
                    children: [jsxs("div", {
                      class: "flex-1",
                      children: [jsx("h3", {
                        class: "font-medium text-gray-900",
                        children: post.filename
                      }), jsx("p", {
                        class: "text-sm text-gray-500 mt-1",
                        children: post.title
                      }), jsx("div", {
                        class: "mt-2 flex flex-wrap gap-1",
                        children: post.tags && post.tags.map((tag) => jsx("span", {
                          class: "inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded",
                          children: tag
                        }, tag))
                      }), jsxs("p", {
                        class: "text-xs text-gray-400 mt-2",
                        children: ["Published: ", post.pubDate || "Unknown"]
                      })]
                    }), jsxs("div", {
                      class: "flex space-x-2 ml-4",
                      children: [jsx("button", {
                        type: "button",
                        onClick: () => handleEditPost(post),
                        class: "text-blue-600 hover:text-blue-800 text-sm font-medium",
                        children: "Edit"
                      }), jsx("button", {
                        type: "button",
                        onClick: () => handleDeletePost(post.filename),
                        class: "text-red-600 hover:text-red-800 text-sm font-medium",
                        children: "Delete"
                      })]
                    })]
                  })
                }, post.filename))
              }), jsxs("div", {
                class: "mt-6 p-4 bg-blue-50 rounded-lg",
                children: [jsx("h3", {
                  class: "font-medium text-blue-800",
                  children: "How it works"
                }), jsxs("ul", {
                  class: "mt-2 text-sm text-blue-700 space-y-1",
                  children: [jsx("li", {
                    children: "• Write markdown in the editor"
                  }), jsx("li", {
                    children: '• Click "Save Post" to save to the blog directory'
                  }), jsx("li", {
                    children: "• Posts will be automatically available at /blog/[slug]"
                  }), jsx("li", {
                    children: '• Edit existing posts by clicking "Edit"'
                  }), jsx("li", {
                    children: '• Delete posts with the "Delete" button'
                  })]
                })]
              })]
            })]
          })]
        })]
      })
    })
  });
}

const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Panel - Blog Editor" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogEditor", BlogEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Ahmed Talal/Desktop/astro-blog/src/components/BlogEditor.jsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin.astro", void 0);

const $$file = "C:/Users/Ahmed Talal/Desktop/astro-blog/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

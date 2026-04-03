import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const swalDefaults = {
  customClass: { popup: "ad-swal" },
  background: "#141210",
  backdrop: "rgba(14,12,10,0.75)"
};

export default function AddEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
    altImage: "",
    author: "Jofta Solemates",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    tags: [],
    published: true
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: token }
      });
      const data = await response.json();
      if (data.success) {
        setFormData(data.post);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = id ? `http://localhost:5000/api/posts/${id}` : "http://localhost:5000/api/posts";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          ...swalDefaults,
          icon: "success",
          title: id ? "Post Updated!" : "Post Created!",
          timer: 1500,
          showConfirmButton: false
        });
        navigate("/admin");
      } else {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      Swal.fire({
        ...swalDefaults,
        icon: "error",
        title: "Error",
        text: "Failed to save post. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>
        {id ? "Edit Post" : "Create New Post"}
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
        {id ? "Update your existing blog post" : "Add a new article to your blog"}
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Fashion">Fashion</option>
              <option value="Tips">Tips</option>
              <option value="Shoes">Shoes</option>
              <option value="Trends">Trends</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Excerpt (Short Description) *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Full Content (HTML supported)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace" }}
              placeholder="Write your full blog post content here. HTML tags are supported for formatting."
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Main Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/..."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Alternative Image URL (Optional)</label>
            <input
              type="url"
              name="altImage"
              value={formData.altImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>Tags</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag (e.g., Fashion)"
                style={{ flex: 1, ...inputStyle }}
              />
              <button type="button" onClick={addTag} style={buttonStyle}>
                Add Tag
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {formData.tags.map(tag => (
                <span key={tag} style={tagStyle}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} style={removeTagStyle}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--gold)" }}>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                style={{ marginRight: "8px" }}
              />
              Publish immediately
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <button type="submit" disabled={loading} style={{ ...buttonStyle, background: "var(--gold)", color: "var(--bg)" }}>
            {loading ? "Saving..." : id ? "Update Post" : "Publish Post"}
          </button>
          <button type="button" onClick={() => navigate("/admin")} style={{ ...buttonStyle, background: "transparent", border: "1px solid var(--border)" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  background: "var(--bg-input)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none"
};

const buttonStyle = {
  padding: "10px 24px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500"
};

const tagStyle = {
  background: "var(--bg-input)",
  padding: "6px 12px",
  borderRadius: "4px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px"
};

const removeTagStyle = {
  background: "none",
  border: "none",
  color: "var(--danger)",
  cursor: "pointer",
  fontSize: "16px",
  padding: "0 4px"
};
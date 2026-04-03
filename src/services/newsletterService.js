const API_BASE = "http://localhost:5000/api";

export const subscribeToNewsletter = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Subscription failed");
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const unsubscribeFromNewsletter = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/newsletter/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Unsubscribe failed");
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSubscriberCount = async () => {
  try {
    const response = await fetch(`${API_BASE}/newsletter/count`);
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    return 0;
  }
};
// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loading = document.getElementById("loading");

  if (!loginForm || !loading) {
    console.error("المنت‌های ضروری پیدا نشدند!");
    return;
  }

  async function checkUser() {
    loading.style.display = "block";
    loginForm.style.display = "none";

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    loading.style.display = "none";

    if (user) {
      window.location.href = "/Kingo-compressor/account";
    } else {
      loginForm.style.display = "block";
    }
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    loading.style.display = "block";
    loginForm.style.display = "none";

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      loading.style.display = "none";
      loginForm.style.display = "block";
      alert("ورود ناموفق: " + error.message);
    } else {
      window.location.href = "/Kingo-compressor/account";
    }
  });

  checkUser();
});

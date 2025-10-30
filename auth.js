// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiI6InN1cGFiYXNlIiwicmVmIjoieW1qZ2lkcnRkY3J3amNsd2V6dW4iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MTgxNDEzNCwiZXhwIjoyMDc3MzkwMTM0fQ.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loading = document.getElementById("loading");

  if (!loginForm || !loading) return;

  // چک کاربر (اگر قبلاً لاگین کرده بود)
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

  // ورود
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
      // مستقیم به صفحه حساب
      window.location.href = "/Kingo-compressor/account";
    }
  });

  checkUser();
});

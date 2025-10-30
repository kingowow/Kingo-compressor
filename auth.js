// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loading = document.getElementById("loading");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  if (!loginForm || !registerForm || !loading) return;

  // سوئیچ بین فرم‌ها
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // بررسی وضعیت کاربر
  async function checkUser() {
    loading.style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "none";

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
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

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

  // ثبت‌نام
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!email || !password) {
      alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }
    if (password.length < 6) {
      alert("رمز عبور باید حداقل 6 کاراکتر باشد.");
      return;
    }

    loading.style.display = "block";
    registerForm.style.display = "none";

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      loading.style.display = "none";
      registerForm.style.display = "block";
      alert("ثبت‌نام ناموفق: " + error.message);
    } else {
      alert("ثبت‌نام موفق! ایمیل تأیید ارسال شد. لطفاً ایمیل خود را چک کنید.");
      window.location.href = "/Kingo-compressor/account";
    }
  });

  checkUser();
});

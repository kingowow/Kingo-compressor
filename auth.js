// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// نمایش بخش مورد نظر و مخفی کردن بقیه
function showSection(sectionId) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("login-success").style.display = "none";

  if (sectionId) {
    document.getElementById(sectionId).style.display = "block";
  }
}

// باز کردن اپ (با تأخیر برای نمایش UI)
function tryOpenApp(email) {
  setTimeout(() => {
    const appUrl = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
    window.location.href = appUrl;
  }, 2000); // 2 ثانیه فرصت برای دیدن پیام
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  // نمایش فرم ورود در ابتدا
  showSection("login-form");

  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("register-form");
  });

  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("login-form");
  });

  // --- ورود ---
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    if (!email || !password) {
      alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    showSection("loading");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("ورود ناموفق: " + error.message);
      showSection("login-form");
    } else {
      showSection("login-success");
      setupSuccessActions(data.user.email);
      tryOpenApp(data.user.email);
    }
  });

  // --- ثبت‌نام ---
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email")?.value.trim();
    const password = document.getElementById("register-password")?.value.trim();

    if (!email || !password || password.length < 6) {
      alert("لطفاً ایمیل و رمز عبور (حداقل 6 کاراکتر) را وارد کنید.");
      return;
    }

    showSection("loading");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("ثبت‌نام ناموفق: " + error.message);
      showSection("register-form");
    } else {
      showSection("login-success");
      setupSuccessActions(email);
      tryOpenApp(email);
    }
  });

  // تنظیم دکمه‌های صفحه موفقیت
  function setupSuccessActions(email) {
    document.getElementById("open-app")?.addEventListener("click", () => {
      const appUrl = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
      window.location.href = appUrl;
    });

    document.getElementById("account-details")?.addEventListener("click", (e) => {
      e.preventDefault();
      alert(`📧 ایمیل شما: ${email}`);
    });

    document.getElementById("change-account")?.addEventListener("click", async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      showSection("login-form");
    });
  }
});

// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// تنظیمات Supabase
const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// فقط بعد از لود کامل DOM
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const successDiv = document.getElementById("login-success");
  const userEmailText = document.getElementById("user-email");
  const logoutBtn = document.getElementById("logout-btn");
  const loading = document.getElementById("loading");

  // چک کردن وجود المنت‌ها
  if (!loginForm || !successDiv || !userEmailText || !logoutBtn || !loading) {
    console.error("یکی از المنت‌های DOM پیدا نشد!");
    return;
  }

  // تابع نمایش وضعیت
  async function checkUser() {
    // ابتدا همه چیز مخفی + لودینگ
    loading.style.display = "block";
    loginForm.style.display = "none";
    successDiv.style.display = "none";

    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      loading.style.display = "none";

      if (user && user.email) {
        console.log("کاربر وارد شده:", user.email);
        successDiv.style.display = "block";
        userEmailText.textContent = user.email;
      } else {
        console.log("کاربر وارد نشده");
        loginForm.style.display = "block";
      }
    } catch (err) {
      loading.style.display = "none";
      loginForm.style.display = "block";
      console.error("خطا در بررسی وضعیت کاربر:", err);
    }
  }

  // ورود کاربر
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.style.display = "none";
      loginForm.style.display = "block";
      alert("ورود ناموفق: " + error.message);
    } else {
      alert("با موفقیت وارد شدید!");
      await checkUser();
    }
  });

  // خروج کاربر
  logoutBtn.addEventListener("click", async () => {
    loading.style.display = "block";
    successDiv.style.display = "none";

    await supabase.auth.signOut();
    alert("با موفقیت خارج شدید!");
    await checkUser();
  });

  // اجرای اولیه
  checkUser();
});

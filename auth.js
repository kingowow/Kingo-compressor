// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// تابع ارسال به اپلیکیشن
function redirectToApp(email) {
  const appUrl = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
  window.location.href = appUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loading = document.getElementById("loading");
  const loginSuccess = document.getElementById("login-success");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  if (!loginForm || !registerForm || !loading || !loginSuccess || !showRegister || !showLogin) {
    console.error("یکی از المنت‌ها پیدا نشد!");
    return;
  }

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "block";
    loginForm.style.display = "none";
  });

  async function showSuccess(email) {
    // مخفی کردن همه چیز
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    loading.style.display = "none";
    loginSuccess.style.display = "block";

    // تنظیم رویدادها
    document.getElementById("open-app").onclick = () => {
      redirectToApp(email);
    };

    document.getElementById("account-details").onclick = (e) => {
      e.preventDefault();
      alert(`📧 ایمیل شما: ${email}`);
    };

    document.getElementById("change-account").onclick = async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      loginSuccess.style.display = "none";
      loginForm.style.display = "block";
    };

    // ⬇️ تغییر: تأخیر را به 1500 میلی‌ثانیه افزایش دادیم تا پیام کاملاً نمایش داده شود
    setTimeout(() => {
      redirectToApp(email);
    }, 1500); // 1.5 ثانیه
  }

  async function checkUser() {
    loading.style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "none";

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (user) {
      showSuccess(user.email); // ✅ اول پیام می‌آید، بعد redirect
    } else {
      loading.style.display = "none";
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.style.display = "none";
      loginForm.style.display = "block";
      alert("ورود ناموفق: " + error.message);
    } else {
      showSuccess(data.user.email); // ✅ اول پیام، بعد redirect
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

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      loading.style.display = "none";
      registerForm.style.display = "block";
      alert("ثبت‌نام ناموفق: " + error.message);
    } else {
      showSuccess(email); // ✅ اول پیام، بعد redirect
    }
  });

  // اجرای اولیه
  checkUser();
});

// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// تابع ارسال به اپلیکیشن (فقط یک‌بار)
function redirectToApp(email) {
  const appUrl = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
  // سعی در باز کردن اپ — اما اجازه بده صفحه باقی بماند
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = appUrl;
  document.body.appendChild(iframe);
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}

// نمایش پیام موفقیت
async function showSuccess(email) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loading = document.getElementById("loading");
  const loginSuccess = document.getElementById("login-success");

  loginForm.style.display = "none";
  registerForm.style.display = "none";
  loading.style.display = "none";
  loginSuccess.style.display = "block";

  // ذخیره وضعیت در localStorage
  localStorage.setItem("login_success_email", email);

  // تنظیم دکمه‌ها
  document.getElementById("open-app").onclick = () => redirectToApp(email);
  document.getElementById("account-details").onclick = (e) => {
    e.preventDefault();
    alert(`📧 ایمیل شما: ${email}`);
  };
  document.getElementById("change-account").onclick = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    localStorage.removeItem("login_success_email");
    loginSuccess.style.display = "none";
    loginForm.style.display = "block";
  };

  // redirect به اپ (با iframe برای جلوگیری از ترک صفحه)
  redirectToApp(email);
}

// بررسی وضعیت ذخیره‌شده
async function checkSavedLogin() {
  const savedEmail = localStorage.getItem("login_success_email");
  const loading = document.getElementById("loading");
  const loginSuccess = document.getElementById("login-success");

  if (savedEmail) {
    // نمایش مستقیم پیام موفقیت بدون redirect
    loading.style.display = "none";
    loginSuccess.style.display = "block";
    showSuccess(savedEmail); // فقط برای تنظیم دکمه‌ها
    return true;
  }
  return false;
}

document.addEventListener("DOMContentLoaded", async () => {
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

  // ابتدا بررسی کن: آیا قبلاً لاگین شده‌ایم؟
  const hasSavedLogin = await checkSavedLogin();
  if (hasSavedLogin) {
    return; // دیگر کاری نکن
  }

  // نمایش فرم اولیه
  loginForm.style.display = "block";

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

  // --- ورود ---
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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      loading.style.display = "none";
      loginForm.style.display = "block";
      alert("ورود ناموفق: " + error.message);
    } else {
      showSuccess(data.user.email);
    }
  });

  // --- ثبت‌نام ---
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!email || !password || password.length < 6) {
      alert("لطفاً ایمیل و رمز عبور (حداقل 6 کاراکتر) را وارد کنید.");
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
      showSuccess(email);
    }
  });
});

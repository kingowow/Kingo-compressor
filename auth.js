// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// استخراج پارامترهای URL
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    status: params.get("status"),
    email: params.get("email")
  };
}

// باز کردن اپ از صفحه موفقیت
function redirectToApp(email) {
  const appUrl = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
  // اجازه بده 2-3 ثانیه UI نمایش داده بشه، بعد سعی در باز کردن اپ
  setTimeout(() => {
    window.location.href = appUrl;
  }, 2000);
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loading = document.getElementById("loading");
  const loginSuccess = document.getElementById("login-success");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  // بررسی حالت موفقیت از URL
  const { status, email } = getUrlParams();
  if (status === "success" && email) {
    // نمایش صفحه موفقیت
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    loading.style.display = "none";
    loginSuccess.style.display = "block";

    // تنظیم دکمه‌ها
    document.getElementById("open-app").onclick = () => window.location.href = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
    document.getElementById("account-details").onclick = (e) => {
      e.preventDefault();
      alert(`📧 ایمیل شما: ${email}`);
    };
    document.getElementById("change-account").onclick = async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = window.location.pathname; // بازگشت به صفحه اصلی
    };

    // سعی در باز کردن اپ (با تأخیر)
    redirectToApp(email);
    return; // ✅ مهم: دیگر لاگین اولیه را اجرا نکن
  }

  // --- حالت عادی (صفحه لاگین) ---
  if (!loginForm || !registerForm || !loading || !loginSuccess || !showRegister || !showLogin) {
    console.error("یکی از المنت‌ها پیدا نشد!");
    return;
  }

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

  // تابع ریدایرکت به صفحه موفقیت
  function goToSuccessPage(email) {
    window.location.href = `?status=success&email=${encodeURIComponent(email)}`;
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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      loading.style.display = "none";
      loginForm.style.display = "block";
      alert("ورود ناموفق: " + error.message);
    } else {
      goToSuccessPage(data.user.email); // ✅ ریدایرکت به حالت موفقیت
    }
  });

  // ثبت‌نام
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
      goToSuccessPage(email); // ✅ ریدایرکت به حالت موفقیت
    }
  });

  // بررسی کاربر لاگین‌شده (اختیاری — اگر نیاز داری)
  // اما توجه: اگر کاربر قبلاً لاگین کرده، بهتر است مستقیماً به /success ریدایرکت شود
  // که این کار را می‌توانی در سرور یا با localStorage هم انجام بدی.
});

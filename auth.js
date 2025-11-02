import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_KEY"; // جایگزین با کلید واقعی
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ارسال به اپلیکیشن
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
  const loginGoogle = document.getElementById("login-google");
  const registerGoogle = document.getElementById("register-google");

  if (!loginForm || !registerForm || !loading || !loginSuccess || !showRegister || !showLogin) {
    console.error("یکی از المنت‌ها پیدا نشد!");
    return;
  }

  // نمایش فرم‌ها
  showRegister.addEventListener("click", e => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });
  showLogin.addEventListener("click", e => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // نمایش پیام موفقیت
  async function showSuccess(email) {
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    loading.style.display = "none";
    loginSuccess.style.display = "block";

    document.getElementById("open-app").onclick = () => redirectToApp(email);
    document.getElementById("account-details").onclick = e => {
      e.preventDefault();
      alert(`📧 ایمیل شما: ${email}`);
    };
    document.getElementById("change-account").onclick = async e => {
      e.preventDefault();
      await supabase.auth.signOut();
      loginSuccess.style.display = "none";
      loginForm.style.display = "block";
    };

    setTimeout(() => redirectToApp(email), 1000);
  }

  // بررسی لاگین قبلی
  async function checkUser() {
    loading.style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "none";

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    loading.style.display = "none";

    if (user) {
      showSuccess(user.email);
    } else {
      loginForm.style.display = "block";
    }
  }

  // ورود با ایمیل/پسورد
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if (!email || !password) return alert("لطفاً ایمیل و رمز عبور را وارد کنید.");

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

  // ثبت‌نام با ایمیل/پسورد
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!email || !password) return alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
    if (password.length < 6) return alert("رمز عبور باید حداقل 6 کاراکتر باشد.");

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

  // ورود/ثبت‌نام با گوگل
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      alert("ورود با گوگل ناموفق: " + error.message);
    }
  }

  loginGoogle.addEventListener("click", signInWithGoogle);
  registerGoogle.addEventListener("click", signInWithGoogle);

  // شروع
  checkUser();
});

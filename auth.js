// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let resendTimerInterval = null;

// بازگشت به اپلیکیشن
function redirectToApp(email) {
  const appUrl = `kingo://auth/callback?email=${encodeURIComponent(email)}`;
  window.location.href = appUrl;
}

// تایمر ارسال مجدد
function startResendTimer() {
  const resendBtn = document.getElementById("resend-email");
  let seconds = 60;
  resendBtn.disabled = true;
  resendBtn.textContent = `ارسال مجدد ایمیل (${seconds}s)`;

  resendTimerInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(resendTimerInterval);
      resendBtn.disabled = false;
      resendBtn.textContent = "ارسال مجدد ایمیل";
    } else {
      resendBtn.textContent = `ارسال مجدد ایمیل (${seconds}s)`;
    }
  }, 1000);
}

// نمایش دیالوگ تأیید ایمیل
function showEmailVerifyWait(email) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("login-success").style.display = "none";
  document.getElementById("email-verify-wait").style.display = "block";

  const checkBtn = document.getElementById("check-email-confirmed");
  const resendBtn = document.getElementById("resend-email");
  const cancelBtn = document.getElementById("cancel-verify");

  checkBtn.onclick = () => {
    window.location.reload();
  };

  resendBtn.onclick = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: "https://kingowow.github.io/Kingo-compressor/",
      },
    });
    if (error) {
      alert("خطا در ارسال مجدد: " + error.message);
    } else {
      alert("✅ ایمیل تأیید مجدد با موفقیت ارسال شد!");
      startResendTimer();
    }
  };

  cancelBtn.onclick = () => {
    if (resendTimerInterval) clearInterval(resendTimerInterval);
    document.getElementById("email-verify-wait").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  };

  if (resendTimerInterval) clearInterval(resendTimerInterval);
  startResendTimer();
}

// نمایش موفقیت
function showSuccess(email) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("email-verify-wait").style.display = "none";
  document.getElementById("login-success").style.display = "block";
  document.getElementById("magic-link-sent").style.display = "none";  // پنهان کردن دیالوگ Magic Link

  document.getElementById("open-app").onclick = () => redirectToApp(email);
  document.getElementById("account-details").onclick = () => {
    window.location.href = "https://kingowow.github.io/Kingo-compressor/account";
  };
  document.getElementById("change-account").onclick = async () => {
    await supabase.auth.signOut();
    document.getElementById("login-success").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  };

  setTimeout(() => redirectToApp(email), 1000);
}

// نمایش پیام ارسال لینک جادویی
function showMagicLinkSent(email) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("login-success").style.display = "none";
  document.getElementById("email-verify-wait").style.display = "none";
  document.getElementById("magic-link-sent").style.display = "block";

  document.getElementById("back-to-login").onclick = () => {
    document.getElementById("magic-link-sent").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("login-email").value = email;
  };
}

// بررسی خودکار وضعیت کاربر
async function checkUser() {
  document.getElementById("loading").style.display = "block";

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (user) {
    if (user.email_confirmed_at) {
      showSuccess(user.email);
    } else {
      showEmailVerifyWait(user.email);
    }
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  }
}

// ========== Event Listeners ==========
document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });
  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  const handleGoogleLogin = async () => {
    document.getElementById("loading").style.display = "block";
    loginForm.style.display = "none";
    registerForm.style.display = "none";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://kingowow.github.io/Kingo-compressor/",
      },
    });

    if (error) {
      document.getElementById("loading").style.display = "none";
      loginForm.style.display = "block";
      alert("خطا در ورود با گوگل: " + error.message);
    }
  };

  document.getElementById("google-login")?.addEventListener("click", handleGoogleLogin);
  document.getElementById("google-login-2")?.addEventListener("click", handleGoogleLogin);

  // ورود بدون رمز (Magic Link)
  document.getElementById("magic-login")?.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
      alert("لطفاً ایمیل خود را وارد کنید.");
      return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("login-form").style.display = "none";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://kingowow.github.io/Kingo-compressor/",
      },
    });

    if (error) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("login-form").style.display = "block";
      alert("خطا: " + error.message);
    } else {
      showMagicLinkSent(email);
    }
  });

  // Login
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    if (!email || !password) {
      alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    document.getElementById("loading").style.display = "block";
    loginForm.style.display = "none";

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      document.getElementById("loading").style.display = "none";
      loginForm.style.display = "block";
      if (error.message.includes("Invalid login credentials")) {
        alert("❌ ایمیل یا رمز عبور اشتباه است.");
      } else if (error.message.includes("Email not confirmed")) {
        showEmailVerifyWait(email);
      } else {
        alert("❌ " + error.message);
      }
    } else {
      showSuccess(data.user.email);
    }
  });

  // Register
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email")?.value.trim();
    const password = document.getElementById("register-password")?.value.trim();

    if (!email || !password) {
      alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }
    if (password.length < 6) {
      alert("رمز عبور باید حداقل 6 کاراکتر باشد.");
      return;
    }

    document.getElementById("loading").style.display = "block";
    registerForm.style.display = "none";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://kingowow.github.io/Kingo-compressor/",
      },
    });

    if (error) {
      document.getElementById("loading").style.display = "none";
      registerForm.style.display = "block";
      alert("ثبت‌نام ناموفق: " + error.message);
    } else {
      showEmailVerifyWait(email);
    }
  });

  // ✅ listener برای تغییرات وضعیت لاگین (Magic Link, Google, تأیید ایمیل و ...)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      if (session.user.email_confirmed_at) {
        showSuccess(session.user.email);
      } else {
        showEmailVerifyWait(session.user.email);
      }
    } else if (event === "SIGNED_OUT") {
      document.getElementById("login-success").style.display = "none";
      document.getElementById("magic-link-sent").style.display = "none";
      document.getElementById("login-form").style.display = "block";
    }
  });

  // اجرای اولیه
  await checkUser();
});

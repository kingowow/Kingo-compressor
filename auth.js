import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.querySelector(".login__form");
const successDiv = document.querySelector(".login__success");
const userEmailText = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// بررسی وضعیت ورود فعلی
async function checkUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // کاربر وارد شده
    loginForm.style.display = "none";
    successDiv.style.display = "block";
    userEmailText.textContent = user.email;
  } else {
    // کاربر وارد نشده
    loginForm.style.display = "block";
    successDiv.style.display = "none";
  }
}

// ورود با ایمیل و پسورد
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("❌ Login failed: " + error.message);
  } else {
    alert("✅ Login successful!");
    checkUser();
  }
});

// خروج از حساب
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  alert("Logged out!");
  checkUser();
});

// بررسی وضعیت هنگام بارگذاری صفحه
checkUser();

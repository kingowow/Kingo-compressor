import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ymjgidrtdcrwjclwezun.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById("login-form");
const successDiv = document.getElementById("login-success");
const userEmailText = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// ✅ تابع بررسی وضعیت کاربر
async function checkUser() {
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (user) {
    console.log("✅ Logged in:", user.email);
    loginForm.style.display = "none";
    successDiv.style.display = "block";
    userEmailText.textContent = user.email;
  } else {
    console.log("❌ Not logged in");
    loginForm.style.display = "block";
    successDiv.style.display = "none";
  }
}

// ✅ ورود کاربر
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("❌ Login failed: " + error.message);
  } else {
    alert("✅ Logged in successfully!");
    await checkUser();
  }
});

// ✅ خروج
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  alert("Logged out!");
  await checkUser();
});

// اجرای اولیه
checkUser();

// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = "https://ymjgidrtdcrwjclwezun.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE" // کلید anon کاملت
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.querySelector(".login__form")
const emailInput = document.querySelector('input[type="email"]')
const passwordInput = document.querySelector('input[type="password"]')
const registerLink = document.getElementById("register-link")

const successBox = document.querySelector(".login__success")
const userEmailText = document.getElementById("user-email")
const logoutBtn = document.getElementById("logout-btn")

// بررسی وضعیت لاگین فعلی
checkSession()

async function checkSession() {
  const { data } = await supabase.auth.getSession()
  if (data.session) showUser(data.session.user)
}

// ورود
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) alert("❌ " + error.message)
  else showUser(data.user)
})

// ثبت‌نام (فعلاً غیرفعاله)
registerLink.addEventListener("click", (e) => {
  e.preventDefault()
  alert("ثبت‌نام در نسخه بعدی فعال می‌شود ✅")
})

// خروج
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut()
  alert("خروج انجام شد ✅")
  successBox.style.display = "none"
  form.style.display = "block"
})

// نمایش اطلاعات کاربر
function showUser(user) {
  form.style.display = "none"
  successBox.style.display = "block"
  userEmailText.textContent = `👋 ${user.email}`
}

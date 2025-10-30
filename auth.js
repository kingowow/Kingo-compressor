// auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = "https://ymjgidrtdcrwjclwezun.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamdpZHJ0ZGNyd2pjbHdlenVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQxMzQsImV4cCI6MjA3NzM5MDEzNH0.Et8PfbGMB1E2-tyrmd1do53D3BVvS8foa3j9CE596tE" // کلید anon کاملت
const supabase = createClient(supabaseUrl, supabaseKey)

// انتخاب المان‌ها
const form = document.querySelector(".login__form")
const emailInput = document.querySelector('input[type="email"]')
const passwordInput = document.querySelector('input[type="password"]')
const registerLink = document.getElementById("register-link")

// ======= Login =======
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  if (!email || !password) {
    alert("لطفاً ایمیل و رمز عبور را وارد کنید.")
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) alert("❌ " + error.message)
  else {
    alert("✅ ورود موفق! خوش آمدید " + email)
    // اینجا می‌تونی ریدایرکت به اپ یا داشبورد بذاری
    // window.location.href = "dashboard.html";
  }
})

// ======= Register =======
registerLink.addEventListener("click", async (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  if (!email || !password) {
    alert("برای ثبت‌نام لطفاً ایمیل و رمز عبور را وارد کنید.")
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) alert("❌ خطا در ثبت‌نام: " + error.message)
  else alert("✅ ثبت‌نام با موفقیت انجام شد! لطفاً ایمیل خود را تأیید کنید.")
})

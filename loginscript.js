
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container")
  const signUpButton = document.getElementById("signUp")
  const signInButton = document.getElementById("signIn")

  if (signUpButton && signInButton && container) {
    signUpButton.addEventListener("click", () => container.classList.add("right-panel-active"))
    signInButton.addEventListener("click", () => container.classList.remove("right-panel-active"))
  }

  if (window.isRegisterPanelActive === true && container) {
    container.classList.add("right-panel-active")
  }
})

$(document).ready(() => {
  // Đăng ký form đăng ký
  $("form[asp-page-handler='Register']").validate({
    onkeyup: true,
    onfocusout: function (element) {
      this.element(element) // kiểm tra ngay khi rời khỏi ô nhập
    },
  })

  // Đăng ký form đăng nhập
  $("form[asp-page-handler='Login']").validate({
    onkeyup: true,
    onfocusout: function (element) {
      this.element(element)
    },
  })
})

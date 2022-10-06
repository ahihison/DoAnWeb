var login = document.querySelector(".option-login");
var validation1 = document.querySelector("#form-1");
var validation2 = document.querySelector("#form-2");
var logout = document.querySelector(".option-logout");
var container = document.querySelector(".container");
var checkSingup = document.querySelector(".form-submit-1");
var checkSingin = document.querySelector(".form-submit-2");
var toastSuccess = document.querySelector(".message-notification");
var btnclose = document.querySelector(".close-val1");
var btnclose2 = document.querySelector(".close-val2");
var container = document.querySelector(".container");
var modalContainer = document.querySelector(".modal-container");
var modalContainer2 = document.querySelector(".modal-container2");
var toastFail = document.querySelector(".message-notification-fail");
var signInOut = document.querySelector(".signin-singout");
var userAvatar = document.querySelector(".user-avatar");
var userSingOut = document.querySelector(".option-user-signOut");
function Validator(options) {
  function geParent(elements, selector) {
    while (elements.parentElement) {
      if (elements.parentElement.matches(selector)) {
        return elements.parentElement;
      }
      elements = elements.parentElement;
    }
  }

  var arrayInfo = [
    {
      fullname: "nguyen hong son",
      email: "sonnguyen352003@gmail.com",
      password: "123456",
    },
    {
      fullname: "nguyen van tai",
      email: "taile123@gmail.com",
      password: "000000",
    },
  ];

  var selectorRule = {};
  //hàm thực hiện validate
  function validate(inputElement, rule) {
    var errorElement = geParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    var errorMessage;

    //lấy ra các rule của các selector
    var rules = selectorRule[rule.selector];

    //lập qua từng rules và kiểm tra
    //Nếu có lỗi thì dừng việc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }

      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      geParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      geParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }
    return !!errorMessage;
  }
  // lấy được form elements
  var formElement = document.querySelector(options.form);

  if (formElement) {
    //Lắng nghe sự kiện onsubmit

    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // Lặp qua từng rules và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isInValid = validate(inputElement, rule);
        if (isInValid) {
          isFormValid = false;
          ischeck = false;
        }
      });

      if (isFormValid) {
        //Trường hợp submit với js

        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");

          var formValues = Array.from(enableInputs).reduce(
            function (values, input) {
              switch (input.type) {
                case "radio":
                  values[input.name] = formElement.querySelector(
                    'input[name="' + input.name + '"]:checked'
                  ).value;
                case "checkbox":
                  if (!input.matches(":checked")) {
                    values[input.name] = "";
                    return values;
                  }
                  if (!Array.isArray(values[input.name])) {
                    values[input.name] = [];
                  }
                  values[input.name].push(input.value);
                  break;
                case "file":
                  values[input.name] = input.files;
                  break;
                default:
                  values[input.name] = input.value;
              }

              return values;
            },

            {}
          );

          if (options.form === "#form-1") {
            arrayInfo.push(formValues);
            validation1.classList.remove("active");
            toastSuccess.classList.add("active");
            signInOut.classList.add("active");
            userAvatar.classList.add("active");
          }
          options.onSubmit(arrayInfo);

          if (options.form === "#form-2") {
            var flag = true;
            arrayInfo.forEach((e) => {
              if (
                e.email === `${formValues.email}` &&
                e.password === `${formValues.password}`
              ) {
                validation2.classList.remove("active");
                document.querySelector(".message-text").innerHTML =
                  "Chúc Mừng Bạn Đã Đăng Nhập Thành Công";
                toastSuccess.classList.add("active");
                signInOut.classList.add("active");
                userAvatar.classList.add("active");
                flag = false;
              }
            });
            if (flag == true) {
              toastFail.classList.add("active");
            }
          }
        }
        //submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    //Lặp qua mỗi rule xử lí sự kiện (blur click....)
    options.rules.forEach(function (rule) {
      //Lưu lại các  rules cho mỗi input
      if (Array.isArray(selectorRule[rule.selector])) {
        selectorRule[rule.selector].push(rule.test);
      } else {
        selectorRule[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        //Xử lí trường hợp blur ra khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        // Xử lí mỗi khi người dùng nhập vào input
        inputElement.oninput = function () {
          var errorElement = geParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = "";
          geParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    });
  }
}

//định nghĩa rules
//Nguyên tắc rules
//1. khi có lỗi : => trả về message
//2. Khi hợp lệ: => ko trả về gì hết (undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiếu ${min} ký tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getconfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getconfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
// JS header

var home = document.querySelector(".home");
var shop = document.querySelector(".shop");
var btnHome = document.querySelector(".btn-up");
window.onscroll = function (e) {
  if (window.scrollY >= 942) {
    home.classList.remove("active");
    shop.classList.add("active");
  }
  if (window.scrollY < 942) {
    shop.classList.remove("active");
    home.classList.add("active");
  }
};
// btnHome.addEventListener("click", () => {
//   shop.classList.remove("active");
//   home.classList.add("active");
// });
if (shop) {
  shop.addEventListener("click", () => {
    home.classList.remove("active");
    shop.classList.add("active");
  });
}
if (home) {
  home.addEventListener("click", () => {
    shop.classList.remove("active");
    home.classList.add("active");
  });
}

// js menu

if (login) {
  login.addEventListener("click", () => {
    validation1.classList.add("active");
    validation2.classList.remove("active");
    container.classList.add("active");
  });
}
if (logout) {
  logout.addEventListener("click", () => {
    validation2.classList.add("active");
    validation1.classList.remove("active");
    container.classList.add("active");
  });
}

if (btnclose) {
  btnclose.addEventListener("click", () => {
    container.classList.remove("active");
    validation1.classList.remove("active");
    toastSuccess.classList.remove("active");
  });
}
if (btnclose2) {
  btnclose2.addEventListener("click", () => {
    container.classList.remove("active");
    // toastSuccess.classList.add("active");
    validation2.classList.remove("active");
    toastFail.classList.remove("active");
  });
}
if (container) {
  container.addEventListener("click", () => {
    validation1.classList.remove("active");
    container.classList.remove("active");
    productDetail.classList.remove("active");
  });
}
modalContainer.addEventListener("click", (e) => {
  e.stopPropagation();
});
if (userSingOut) {
  userSingOut.addEventListener("click", () => {
    window.location.reload();
    signInOut.classList.remove("active");
    userAvatar.classList.remove("active");
  });
}
if (container) {
  container.addEventListener("click", () => {
    validation1.classList.remove("active");
    container.classList.remove("active");
    validation2.classList.remove("active");
    toastSuccess.classList.remove("active");
    toastFail.classList.remove("active");
  });
}
modalContainer2.addEventListener("click", (e) => {
  e.stopPropagation();
});

// // Sidebar
const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});
var btnBars = document.querySelector(".btn-bars");
var btnClose = document.querySelector(".close-btn");

var sidaebarEvent = document.querySelector(".sidebar-event");
var containerContent = document.querySelector(".container-content");

if (btnBars) {
  btnBars.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    sidebar.classList.remove("close");
  });
}
btnClose.addEventListener("click", () => {
  sidebar.classList.remove("active");
});
containerContent.addEventListener("click", () => {
  sidebar.classList.remove("active");
});
sidaebarEvent.addEventListener("click", (e) => {
  e.stopPropagation();
});

//Product

const product = [
  {
    id: 1,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 2,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f2.jpg",
    span: "Adidas",
    title: "T-shirt Basic ",
    price: 78,
  },
  {
    id: 3,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f3.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 4,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f4.jpg",
    span: "Gucci",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 5,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/n1.jpg",
    span: "Gucci",
    title: "Sweeter Basic",
    price: 78,
  },
  {
    id: 6,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi1.jpg",
    span: "Gucci",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 7,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/n3.jpg",
    span: "Adidas",
    title: "Normal Clothes",
    price: 78,
  },
  {
    id: 8,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/n4.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 9,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/n5.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 10,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f6.jpg",
    span: "Gucci",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 11,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 12,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi2.jpg",
    span: "Gucci",
    title: "Jacket Man Basic",
    price: 78,
  },
  {
    id: 13,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi3.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 14,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi4.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 15,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi5.jpg",
    span: "Gucci",
    title: "Jean jacket",
    price: 78,
  },
  {
    id: 16,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi6.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 17,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/t-shirt1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 18,
    image:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/t-shirt2.jpg",
    span: "Gucci",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 19,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 20,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f2.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 21,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f3.jpg",
    span: "Gucci",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 22,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f4.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 23,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Gucci",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 24,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f5.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
];
const detailProduct = [
  {
    id: 1,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 139.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world, with a total combined production of production total of 61 million bales annually. The United States is currently the largest exporter of raw cotton, with sales of $4.9 billion annually. The worldwide cotton market is estimated to total at $12 billion.",
    imgsmall1:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    imgsmall2:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f2.jpg",
    imgsmall3:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f3.jpg",
    imgsmall4:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f4.jpg",
  },
  {
    id: 2,
    title: "Jacket",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
    imgsmall1:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi1.jpg",
    imgsmall2:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi2.jpg",
    imgsmall3:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi3.jpg",
    imgsmall4:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/somi4.jpg",
  },
  {
    id: 3,
    title: "Sweeter",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 4,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 139.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world, with a total combined production of production total of 61 million bales annually. The United States is currently the largest exporter of raw cotton, with sales of $4.9 billion annually. The worldwide cotton market is estimated to total at $12 billion.",
  },
  {
    id: 5,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 6,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
    imgsmall1:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    imgsmall2:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f2.jpg",
    imgsmall3:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f3.jpg",
    imgsmall4:
      "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f4.jpg",
  },
  {
    id: 7,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 139.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world, with a total combined production of production total of 61 million bales annually. The United States is currently the largest exporter of raw cotton, with sales of $4.9 billion annually. The worldwide cotton market is estimated to total at $12 billion.",
  },
  {
    id: 8,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 9,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 1,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 139.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world, with a total combined production of production total of 61 million bales annually. The United States is currently the largest exporter of raw cotton, with sales of $4.9 billion annually. The worldwide cotton market is estimated to total at $12 billion.",
  },
  {
    id: 2,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 3,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 1,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 139.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest South Asian farming settlements in the world. China and India are currently the two largest producers of cotton in the world",
  },
  {
    id: 2,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest ",
  },
  {
    id: 3,
    title: "Home /T-Shirt",
    header: "Main's Fashion T Shirt",
    price: 100.0,
    detail:
      "Cotton, the most common T-shirt material, has been grown by humans for over 7,000 years. The first evidence of cotton use was found in the city of Mehrgarh, one of the earliest ",
  },
];
let perPage = 8;
let currentPages = 1;
let start = 0;
let end = perPage;
var btn2 = document.querySelector(".btn-2");
var btnNext = document.querySelector(".btn-next");
var btnPrev = document.querySelector(".btn-prev");
var btnNext1 = document.querySelector(".btn-next1");
var btnPrev1 = document.querySelector(".btn-prev1");
var btnNext2 = document.querySelector(".btn-next2");
var btnPrev2 = document.querySelector(".btn-prev2");

const totalPage = Math.ceil(product.length / perPage);
var productGucci = countProductGucci();
var productAdidas = countProductAdidas();
const totalPageGucci = Math.ceil(productGucci.length / perPage);
const totalPageAdidas = Math.ceil(productAdidas.length / perPage);

function getCurentPage(currentPages) {
  start = (currentPages - 1) * perPage;
  end = currentPages * perPage;
}

function countProductGucci() {
  var productGucci = [];
  product.map((item, index) => {
    if (item.span == "Gucci") {
      productGucci.push(product[index]);
    }
  });
  return productGucci;
}
function countProductAdidas() {
  var productAdidas = [];
  product.map((item, index) => {
    if (item.span == "Adidas") {
      productAdidas.push(product[index]);
    }
  });
  return productAdidas;
}

function renderProduct(product) {
  html = "";

  const content = product.map((item, index) => {
    if (index >= start && index < end) {
      html += `<div class="pro">`;
      html += `<img src=` + item.image + `>`;
      html += `<div class="des">`;
      html += `<span>` + item.span + `</span>`;
      html += `<h5>` + item.title + `</h5>`;
      html += `<div class="star">
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
  </div>`;
      html += `<h4>$` + item.price + `.00</h4>`;
      html += `</div>`;
      html += `
    <i class="fa-solid fa-heart cart"></i>
  `;
      html += `</div>`;
    }
    return html;
  });

  document.querySelector(".pro-container").innerHTML = html;
}
function renderProductGucci(start, end) {
  html = "";

  const content = productGucci.map((item, index) => {
    if (index >= start && index < end) {
      html += `<div class="pro">`;
      html += `<img src=` + item.image + `>`;
      html += `<div class="des">`;
      html += `<span>` + item.span + `</span>`;
      html += `<h5>` + item.title + `</h5>`;
      html += `<div class="star">
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
  </div>`;
      html += `<h4>$` + item.price + `.00</h4>`;
      html += `</div>`;
      html += `
    <i class="fa-solid fa-heart cart"></i>
  `;
      html += `</div>`;
    }
    return html;
  });

  document.querySelector(".pro-container-gucci").innerHTML = html;
}
function renderProducAdidas() {
  html = "";

  const content = productAdidas.map((item, index) => {
    if (index >= start && index < end) {
      html += `<div class="pro">`;
      html += `<img src=` + item.image + `>`;
      html += `<div class="des">`;
      html += `<span>` + item.span + `</span>`;
      html += `<h5>` + item.title + `</h5>`;
      html += `<div class="star">
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
  </div>`;
      html += `<h4>$` + item.price + `.00</h4>`;
      html += `</div>`;
      html += `
    <i class="fa-solid fa-heart cart"></i>
  `;
      html += `</div>`;
    }
    return html;
  });

  document.querySelector(".pro-container-adidas").innerHTML = html;
}

function renderListPageGucci(totalPageGucci) {
  let html = "";
  html += `<button class="active">${1}</button>`;
  for (let i = 2; i <= totalPageGucci; i++) {
    html += `<button>${i}</button>`;
  }

  document.querySelector(".number-page1").innerHTML = html;
}
function renderListPageAdidas(totalPageAdidas) {
  let html = "";
  html += `<button class="active">${1}</button>`;
  for (let i = 2; i <= totalPageAdidas; i++) {
    html += `<button>${i}</button>`;
  }

  document.querySelector(".number-page2").innerHTML = html;
}
function gucciProduct() {
  renderProductGucci();
  renderListPageGucci(totalPageGucci);
  btnChangepageGucci(btnNext1, btnPrev1, totalPageGucci);
  changePageGucci();
}
function adidasProduct() {
  renderProducAdidas();
  renderListPageAdidas(totalPageAdidas);
  btnChangepageAdidas(btnNext2, btnPrev2, totalPageAdidas);
  ChangepageAdidas();
}
renderProduct(product);
// getGucciProduct();
renderListPage(totalPage);

var ProductList = document.querySelectorAll("#product1 .pro");
function changePrice(i) {
  var pricePro = document.querySelector(".price-pro-detail");
  var inputChange = document.querySelector(".total-cartshop input");
  inputChange.addEventListener("change", () => {
    const val = document.querySelector(".total-cartshop input").value;
    var totalPrice = val * product[i].price;
    pricePro.innerHTML = `$${totalPrice}.00`;
  });
}

function getIndexProduct(index) {
  html = "";
  html += `<div class="detail-pro">
      
  <section id="prodetails" class="section-p1">
   <div class="single-pro-image">
     <div class="close-detail"><i class="fa-solid fa-xmark btn-close-detail
       "></i></div>
       <img class="shop-item-img" src="./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg" width="100%" height="300px" id="MainImg" alt="">
       <div class="small-img-group">
           <div class="small-img-col">`;
  html +=
    `<img src="` +
    detailProduct[index].imgsmall1 +
    `" width="100%" height="87%" class ="small-img" alt="">`;

  html += `
           </div>`;

  html += `
           <div class="small-img-col">`;
  html +=
    `<img src="` +
    detailProduct[index].imgsmall2 +
    `" width="100%" height="87%" class ="small-img" alt="">`;
  html += `</div>
    <div class="small-img-col">`;
  html +=
    `<img src="` +
    detailProduct[index].imgsmall3 +
    `" width="100%" height="87%" class ="small-img" alt="">`;
  html += `</div>
    <div class="small-img-col">`;
  html +=
    `<img src="` +
    detailProduct[index].imgsmall4 +
    `" width="100%" height="87%" class ="small-img" alt="">`;
  html += ` </div>`;
  html += ` </div>`;
  html += ` </div>`;
  html += `     
   <div class="single-pro-details">`;
  html +=
    `<h6 class ="shop-item-title">` + detailProduct[index].title + `</h6> `;
  html += `<h4>` + detailProduct[index].header + `</h4>`;
  html +=
    `<h2 class="price-pro-detail"> $` + detailProduct[index].price + `.00</h2>`;
  html += ` <select class="size-product-detail" name="" id="">
        <option value="">Select size</option>
        <option value="">XL</option>
        <option value="">XXL</option>
        <option value="">Small</option>
        <option value="">Large</option>
    </select>
    <div class="total-cartshop"> <input type="number" value="1" min="1">
      <button class="normal shop-item-button">Add To Cart</button></div>

    <h4>Product Details</h4>
    <div class="details-product">`;
  html += `<span>` + detailProduct[index].detail + `</span>`;

  html += `</div>`;
  html += `</div>
  </section>

   </div>
`;
  document.querySelector(".detail-container").innerHTML = html;
  changerSmallProduct();
  closeDetail();
}
var containerDetail = document.querySelector(".container-detail");

function innerDetail() {
  const currentProduct = document.querySelectorAll("#product1 .pro");
  console.log(currentProduct);
  for (let i = 0; i < currentProduct.length; i++) {
    currentProduct[i].addEventListener("click", () => {
      getIndexProduct(i);
      console.log(currentProduct[i]);
      changePrice(i);
      productDetail.classList.add("active");
      // container.classList.add("active");
      containerDetail.classList.add("active");
      var addToCartButtons = document.querySelectorAll(".shop-item-button");
      console.log(addToCartButtons);

      var button = addToCartButtons[0];
      button.addEventListener("click", addToCartClicked);

      if (currentPages == 2) {
        getIndexProduct(i + perPage);
        changerSmallProduct();
        changePrice(i);
        closeDetail();
      }
    });
  }
}

innerDetail();
function renderListPage(totalPage) {
  let html = "";
  html += `<button class="active">${1}</button>`;
  for (let i = 2; i <= totalPage; i++) {
    html += `<button>${i}</button>`;
  }

  document.querySelector(".number-page").innerHTML = html;
}
function changePage() {
  const currentPage = document.querySelectorAll(".number-page button");

  for (let i = 0; i < currentPage.length; i++) {
    currentPage[i].addEventListener("click", () => {
      const value = i + 1;
      currentPages = value;
      getCurentPage(currentPages);
      renderProduct(product);
      innerDetail();
      // changePrice(i);
      const btnActive = document.querySelector("button.active");
      btnActive.classList.remove("active");
      currentPage[i].classList.add("active");
    });
  }
}
function changePageGucci() {
  const currentPage = document.querySelectorAll(".number-page1 button");
  currentPages = 1;

  for (let i = 0; i < currentPage.length; i++) {
    currentPage[i].addEventListener("click", () => {
      const value = i + 1;
      currentPages = value;
      getCurentPage(currentPages);
      renderProductGucci(start, end);
      innerDetail();
      // changePrice(i);
      const btnActive = document.querySelector(".number-page1 button.active");

      btnActive.classList.remove("active");
      currentPage[i].classList.add("active");
    });
  }
}
function ChangepageAdidas() {
  const currentPage = document.querySelectorAll(".number-page2 button");

  currentPages = 1;
  for (let i = 0; i < currentPage.length; i++) {
    currentPage[i].addEventListener("click", () => {
      const value = i + 1;
      currentPages = value;
      getCurentPage(currentPages);
      renderProducAdidas(start, end);
      innerDetail();
      // changePrice(i);
      const btnActive = document.querySelector(".number-page2 button.active");

      btnActive.classList.remove("active");
      currentPage[i].classList.add("active");
    });
  }
}
var allProduct = document.querySelector(".all-product");
var gucciProduct = document.querySelector(".gucci-product");
var adidasProduct = document.querySelector(".adidas-product");
var procontainer = document.querySelector("#product1 .pro-container");
var pagingItem = document.querySelector(".paging-item");
var containerAllProduct = document.querySelector(".container-product-all");
var numberPage = document.querySelector(".number-page");
var pagingItem1 = document.querySelector(".paging-item1");
var pagingItem2 = document.querySelector(".paging-item2");

gucciProduct.addEventListener("click", () => {
  procontainer.classList.add("remove");
  procontainer.classList.add("pro-container-gucci");
  pagingItem.classList.add("active");
  pagingItem1.classList.add("active");
  procontainer.classList.remove("remove");
  procontainer.classList.remove("pro-container-adidas");
  pagingItem2.classList.remove("active");
  gucciProduct.classList.add("active");
  allProduct.classList.add("color");

  adidasProduct.classList.remove("active");
  start = 0;
  end = perPage;
  renderProductGucci(start, end);
  renderListPageGucci(totalPageGucci);
  btnChangepageGucci(btnNext1, btnPrev1, totalPageGucci);
  changePageGucci();
  innerDetail();
});
adidasProduct.addEventListener("click", () => {
  procontainer.classList.remove("remove");
  procontainer.classList.remove("pro-container-gucci");
  pagingItem.classList.remove("active");
  pagingItem1.classList.remove("active");
  procontainer.classList.add("remove");
  procontainer.classList.add("pro-container-adidas");
  pagingItem.classList.add("active");
  pagingItem2.classList.add("active");
  adidasProduct.classList.add("active");
  allProduct.classList.add("color");
  gucciProduct.classList.remove("active");
  start = 0;
  end = perPage;
  renderProducAdidas(start, end);

  renderListPageAdidas(totalPageAdidas);
  btnChangepageAdidas(btnNext2, btnPrev2, totalPageAdidas);
  ChangepageAdidas();
  innerDetail();
});
allProduct.addEventListener("click", () => {
  procontainer.classList.remove("remove");
  procontainer.classList.remove("pro-container-gucci");
  pagingItem.classList.add("active");
  pagingItem1.classList.remove("active");
  procontainer.classList.remove("remove");
  procontainer.classList.remove("pro-container-adidas");
  pagingItem.classList.remove("active");
  pagingItem2.classList.remove("active");
  adidasProduct.classList.remove("active");
  gucciProduct.classList.remove("active");
  allProduct.classList.add("active");
  allProduct.classList.remove("color");

  renderProduct(product);
  innerDetail();
});
changePage();
function btnChangepage(btnNext, btnPrev, totalPage) {
  btnNext.addEventListener("click", () => {
    currentPages++;
    if (currentPages > totalPage) {
      currentPages = totalPage;
    } else {
      const btnActive = document.querySelector(".number-page button.active");

      btnActive.classList.remove("active");
      let nextBtnActive = btnActive.nextElementSibling;
      nextBtnActive.classList.add("active");
    }
    getCurentPage(currentPages);
    renderProduct(product);
    innerDetail();
  });
  btnPrev.addEventListener("click", () => {
    currentPages--;

    if (currentPages < 1) {
      currentPages = 1;
    } else {
      const btnActive = document.querySelector("button.active");
      btnActive.classList.remove("active");
      let prevBtnActive = btnActive.previousElementSibling;
      if (prevBtnActive) {
        prevBtnActive.classList.add("active");
      }
    }

    getCurentPage(currentPages);

    renderProduct(product);
    innerDetail();
    // changePrice(i);
  });
}
btnChangepage(btnNext, btnPrev, totalPage);
// btnChangepageGucci(btnNext, btnPrev, totalPageGucci);
function btnChangepageGucci(btnNext, btnPrev, totalPage) {
  btnNext.addEventListener("click", () => {
    currentPages++;
    if (currentPages > totalPage) {
      currentPages = totalPage;
    } else {
      const btnActive = document.querySelector(".number-page1 button.active");

      btnActive.classList.remove("active");
      let nextBtnActive = btnActive.nextElementSibling;
      nextBtnActive.classList.add("active");
    }
    getCurentPage(currentPages);
    renderProductGucci(start, end);
    innerDetail();
    // changePrice(i);
  });
  btnPrev.addEventListener("click", () => {
    currentPages--;

    if (currentPages < 1) {
      currentPages = 1;
    } else {
      const btnActive = document.querySelector(".number-page1 button.active");
      btnActive.classList.remove("active");
      let prevBtnActive = btnActive.previousElementSibling;
      if (prevBtnActive) {
        prevBtnActive.classList.add("active");
      }
    }

    getCurentPage(currentPages);
    renderProductGucci(start, end);
    innerDetail();
    // changePrice(i);
  });
}
function btnChangepageAdidas(btnNext, btnPrev, totalPage) {
  btnNext.addEventListener("click", () => {
    currentPages++;
    if (currentPages > totalPage) {
      currentPages = totalPage;
    } else {
      const btnActive = document.querySelector(".number-page2 button.active");

      btnActive.classList.remove("active");
      let nextBtnActive = btnActive.nextElementSibling;
      nextBtnActive.classList.add("active");
    }
    getCurentPage(currentPages);
    renderProducAdidas(start, end);
    innerDetail();
    // changePrice(i);
  });
  btnPrev.addEventListener("click", () => {
    currentPages--;

    if (currentPages < 1) {
      currentPages = 1;
    } else {
      const btnActive = document.querySelector(".number-page2 button.active");
      btnActive.classList.remove("active");
      let prevBtnActive = btnActive.previousElementSibling;
      if (prevBtnActive) {
        prevBtnActive.classList.add("active");
      }
    }

    getCurentPage(currentPages);
    renderProducAdidas(start, end);
    innerDetail();
    // changePrice(i);
  });
}
// var itemProduct = document.querySelector("#product1 .pro");
var productDetail = document.querySelector(".detail-container");

// itemProduct.addEventListener("click", () => {
//   productDetail.classList.add("active");
//   container.classList.add("active");
// });
productDetail.addEventListener("click", (e) => {
  e.stopPropagation();
});
function closeDetail() {
  var btnCloseDetail = document.querySelectorAll(".close-detail");
  for (var i = 0; i < btnCloseDetail.length; i++) {
    btnCloseDetail[i].addEventListener("click", () => {
      productDetail.classList.remove("active");
      containerDetail.classList.remove("active");
    });
  }
}

containerDetail.addEventListener("click", () => {
  containerDetail.classList.remove("active");
});
// function getVal() {
//   const val = document.querySelector(".total-cartshop input").value;
// }

// getVal();
// Change item product

function changerSmallProduct() {
  var MainImg = document.getElementById("MainImg");
  var smallimg = document.getElementsByClassName("small-img");

  smallimg[0].onclick = function () {
    MainImg.src = smallimg[0].src;
  };
  smallimg[1].onclick = function () {
    MainImg.src = smallimg[1].src;
  };
  smallimg[2].onclick = function () {
    MainImg.src = smallimg[2].src;
  };
  smallimg[3].onclick = function () {
    MainImg.src = smallimg[3].src;
  };
}

// Shop cart
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
function ready() {
  var removeItemShopCart = document.querySelectorAll(".btn-close-shopcart");

  for (var i = 0; i < removeItemShopCart.length; i++) {
    var button = removeItemShopCart[i];
    button.addEventListener("click", removeCartItem);
  }
  var quantityInputs = document.querySelectorAll(".cart-quality");

  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChange);
  }
  var addToCartButtons = document.querySelectorAll(".shop-item-button");

  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }
  document
    .querySelectorAll(".btn-purchase")[0]
    .addEventListener("click", purChaseClicked);
}
function purChaseClicked() {
  alert("Thanks you for your purchase");
  var cartItems = document.querySelectorAll(".cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
}
function addToCartClicked(e) {
  var button = e.target;
  document.querySelector(".cart-no-item").classList.add("active");
  document.querySelector(".table-bill").classList.add("active");
  document.querySelector(".cart-total-bill").classList.add("active");
  document.querySelector(".container-content-no-item").classList.add("active");
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.querySelectorAll(".shop-item-title")[0].innerText;
  var price = shopItem.querySelectorAll(".price-pro-detail")[0].innerText;
  var imgSrc = document.querySelectorAll(".shop-item-img")[0].src;
  var e = document.querySelector(".size-product-detail");

  addItemToCart(title, price, imgSrc);
  updateCartTotal();
}
function addItemToCart(title, price, imgSrc) {
  var cartRow = document.createElement("tr");
  cartRow.classList.add("cart-row");
  var cartItems = document.querySelectorAll(".cart-items")[0];
  var carItemNames = document.querySelectorAll(".cart-item-title");
  for (var i = 0; i < carItemNames.length; i++) {
    if (carItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }
  var cartRowContent = `<td>
  <a class="btn-close-shopcart" href="#"><i class="far fa-times-circle "></a></i>
  </td>
  <td><img src="${imgSrc}" alt=""></td>
  <td class="cart-item-title">${title}</td>
  <td class="cart-price">${price}</td>
  <td ><input class="cart-quality" type="number" value="1" min="1"></td>
  <td><select class="size-product-detail" name="" id="">
  <option value="">Select size</option>
  <option value="">XL</option>
  <option value="">XXL</option>
  <option value="">Small</option>
  <option value="">Large</option>
</select>
  </td>`;
  cartRow.innerHTML = cartRowContent;
  cartItems.append(cartRow);
  cartRow
    .querySelectorAll(".btn-close-shopcart")[0]
    .addEventListener("click", removeCartItem);

  cartRow
    .querySelectorAll(".cart-quality")[0]
    .addEventListener("change", quantityChange);
}
function removeCartItem(e) {
  var buttonClicked = e.target;
  if (buttonClicked) {
    alert("are you sure");
  }
  buttonClicked.parentElement.parentElement.parentElement.remove();
  updateCartTotal();
}
function quantityChange(e) {
  var input = e.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function updateCartTotal() {
  var cartItemContainer = document.querySelectorAll(".cart-items")[0];
  var cartRows = cartItemContainer.querySelectorAll(".cart-row");

  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.querySelectorAll(".cart-price")[0];
    var qualityElement = cartRow.querySelectorAll(".cart-quality")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = qualityElement.value;

    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.querySelectorAll(".cart-total-price")[0].innerText = `$` + total;
  document.querySelectorAll(".Last-total-price")[0].innerText = `$` + total;
}
document.querySelector(".btn-close-no-item").addEventListener("click", () => {
  document.querySelector(".container-cart-shop").classList.remove("active");
});
document.querySelector(".cart-shop-item").addEventListener("click", () => {
  document.querySelector(".container-cart-shop").classList.add("active");
});

var filterInput = document.querySelector(".search-text");
filterInput.addEventListener("keyup", filterProducts);

function filterProducts() {
  // pagingItem.classList.add("active");
  let filterValue = filterInput.value.toUpperCase();

  var productFilter = [];
  for (let i = 0; i < product.length; i++) {
    let span = product[i].title;
    if (span.toUpperCase().indexOf(filterValue) > -1) {
      productFilter.push(product[i]);
      renderProduct(productFilter);
      // renderListPageGucci(productFilter);
      // getCurentPage(currentPages);
      renderListPageGucci(ProductList);
      renderListPageAdidas(productFilter);
      renderListPage(productFilter);
    } else {
      renderProduct(productFilter);

      innerDetail();
    }
    if (filterValue == "") {
      renderListPageGucci(totalPageGucci);
      renderListPageAdidas(totalPageAdidas);
      renderListPage(totalPage);
      innerDetail();
    }
  }
}

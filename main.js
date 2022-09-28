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
  if (window.scrollY >= 1000) {
    home.classList.remove("active");
    shop.classList.add("active");
  }
  if (window.scrollY < 1000) {
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

// if (checkSingup) {
//   checkSingup.addEventListener("click", () => {
//     validation1.classList.remove("active");
//     toastSuccess.classList.add("active");
//     container.classList.remove("active");
//   });
// }

// if (checkSingin) {
//   checkSingin.addEventListener("click", () => {
//     validation2.classList.remove("active");
//     toastSuccess.classList.add("active");
//     // container.classList.remove("active");
//   });
// }
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
    title: "Cartoon Astronaut T-Shirts",
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
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 5,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 6,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f5.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 7,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f6.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 8,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f7.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 9,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f8.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 10,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 11,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 12,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f2.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 13,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 14,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 15,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 16,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 17,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f1.jpg",
    span: "Adidas",
    title: "Cartoon Astronaut T-Shirts",
    price: 78,
  },
  {
    id: 18,
    image: "./img/Build-and-Deploy-Ecommerce-Website-main/img/products/f2.jpg",
    span: "Adidas",
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
    span: "Adidas",
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
    span: "Adidas",
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
const totalPage = Math.ceil(product.length / perPage);
function getCurentPage(currentPages) {
  start = (currentPages - 1) * perPage;
  end = currentPages * perPage;
}
function renderProduct() {
  html = "";
  const content = product.map((item, index) => {
    if (index >= start && index < end) {
      html += `<div class="pro">`;
      html += `<img src=` + item.image + `/>`;
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
      html += `<h4>$` + item.price + `</h4>`;
      html += `</div>`;
      html += `<a href="#">
    <i class="fa-solid fa-heart cart"></i>
  </a>`;
      html += `</div>`;
    }
    return html;
  });

  document.querySelector(".pro-container").innerHTML = html;
}

renderProduct();
renderListPage();
var ProductList = document.querySelectorAll("#product1 .pro");
function changePrice(i) {
  var pricePro = document.querySelector(".price-pro-detail");
  var inputChange = document.querySelector(".total-cartshop input");
  inputChange.addEventListener("change", () => {
    const val = document.querySelector(".total-cartshop input").value;
    var totalPrice = val * product[i].price;
    console.log(product[i].price);
    pricePro.innerHTML = `$${totalPrice}.00`;
  });
}
function getIndexProduct(index) {
  console.log(index);
  html = "";
  html += `<h6>` + detailProduct[index].title + `</h6> `;
  html += `<h4>` + detailProduct[index].header + `</h4>`;
  html +=
    `<h2 class="price-pro-detail"> $` + detailProduct[index].price + `</h2>`;
  html += ` <select name="" id="">
        <option value="">Select size</option>
        <option value="">XL</option>
        <option value="">XXL</option>
        <option value="">Small</option>
        <option value="">Large</option>
    </select>
    <div class="total-cartshop"> <input type="number" value="1" min="1">
      <button class="normal">Add To Cart</button></div>

    <h4>Product Details</h4>
    <div class="details-product">`;
  html += `<span>` + detailProduct[index].detail + `</span>`;
  html += `</div>`;
  document.querySelector(".single-pro-details").innerHTML = html;
}

function innerDetail() {
  const currentProduct = document.querySelectorAll("#product1 .pro");

  for (let i = 0; i < currentProduct.length; i++) {
    currentProduct[i].addEventListener("click", () => {
      getIndexProduct(i);
      changePrice(i);
      productDetail.classList.add("active");
      container.classList.add("active");
      if (currentPages == 2) {
        getIndexProduct(i + perPage);
        changePrice(i);
      }
    });
  }
}
innerDetail();
function renderListPage() {
  let html = "";
  html += `<button class="active">${1}</button>`;
  for (let i = 2; i <= totalPage; i++) {
    html += `<button>${i}</button>`;
  }

  document.querySelector(".number-page").innerHTML = html;
}
function changePage() {
  const currentPage = document.querySelectorAll(".number-page button");
  // console.log(btnActive);
  // console.log(currentPage);
  for (let i = 0; i < currentPage.length; i++) {
    currentPage[i].addEventListener("click", () => {
      const value = i + 1;
      currentPages = value;
      getCurentPage(currentPages);
      renderProduct();
      innerDetail();
      changePrice(i);
      const btnActive = document.querySelector("button.active");
      btnActive.classList.remove("active");
      currentPage[i].classList.add("active");
    });
  }
}

changePage();
btnNext.addEventListener("click", () => {
  currentPages++;
  if (currentPages > totalPage) {
    currentPages = totalPage;
  } else {
    const btnActive = document.querySelector("button.active");
    btnActive.classList.remove("active");
    let nextBtnActive = btnActive.nextElementSibling;
    nextBtnActive.classList.add("active");
  }
  getCurentPage(currentPages);

  renderProduct();
  innerDetail();
  changePrice(i);
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
  renderProduct();
  innerDetail();
  changePrice(i);
});

// var itemProduct = document.querySelector("#product1 .pro");
var productDetail = document.querySelector(".detail-container");
var btnCloseDetail = document.querySelector(".close-detail");
// itemProduct.addEventListener("click", () => {
//   productDetail.classList.add("active");
//   container.classList.add("active");
// });
btnCloseDetail.addEventListener("click", () => {
  productDetail.classList.remove("active");
  container.classList.remove("active");
});

// function getVal() {
//   const val = document.querySelector(".total-cartshop input").value;
// }

// getVal();
// Change item product

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

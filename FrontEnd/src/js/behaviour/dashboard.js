var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener("DOMContentLoaded", function () {
    var addButton = document.getElementById("addItem");
    var addForm = document.getElementById("popupOverlay");
    var cancelForm = document.getElementById("cancelAddFrom");
    addButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("this works");
        addForm.style.display = "flex";
    });
    cancelForm.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("this also works");
        addForm.style.display = "none";
    });
    var form = document.querySelector("#addForm form");
    form.addEventListener("submit", function (event) { return __awaiter(_this, void 0, void 0, function () {
        var productData, response, result, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault(); // Prevent the default form submission
                    productData = {
                        name: document.querySelector("#name").value.trim(),
                        description: document.querySelector("#description").value.trim(),
                        catagory: document.querySelector("#catagory").value.trim(),
                        price: parseFloat(document.querySelector("#price").value),
                        quantityInStock: parseInt(document.querySelector("#quantityInStock").value, 10),
                        imageURL: document.querySelector("#imageURL").value.trim(),
                        supplierId: parseInt(document.querySelector("#supplierId").value, 10),
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/addProduct", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(productData),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    alert("Product added successfully!");
                    console.log("API Response:", result);
                    form.reset(); // Clear the form
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    error = _a.sent();
                    alert("Failed to add product. " + error.message);
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error("Error adding product:", error_1);
                    alert("An error occurred while adding the product. Please try again.");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});

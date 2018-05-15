//to check if the extension is installed
if (typeof(webExtensionWallet) === "undefined") {
    $("#noExtension").removeClass("hide")
}

var dappAddress = "n1p12u4ngXec2MkrDZAncGPL3GmPGbRaBrf";
var url = "https://testnet.nebulas.io";
//here we use neb.js to call the "get" function to search from the Dictionary
var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(url));
var NebPay = require("nebpay");
var nebPay = new NebPay();


$("#search").click(function () {
    var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "get";
    var callArgs = "[\"" + $("#search_value").val() + "\"]"; //in the form of ["args"]
    var contract = {
        "function": callFunction,
        "args": callArgs
    };
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        cbSearch(resp)
    }).catch(function (err) {
        console.log("error:" + err.message)
    });
});

//return of search,
function cbSearch(resp) {
    console.log("return of rpc call: " + JSON.stringify(resp));
    var result = resp.result;   //resp is an object, resp.result is a JSON string
    if (result === 'null') {
        $(".add_banner").addClass("hide");
        $(".result_success").addClass("hide");

        $("#result_fail_add").text($("#search_value").val())

        $(".result_fail").removeClass("hide");
        if (typeof(webExtensionWallet) !== "undefined") {
            $("#addLink").removeClass("hide")
        }
    } else {
        //if result is not null, then it should be "return value" or "error message"
        try {
            result = JSON.parse(result)
        } catch (err) {
            //result is the error message
        }
        if (!!result.url) {      //"return value"
            $(".add_banner").addClass("hide");
            $(".result_fail").addClass("hide");
            $("#search_banner").text(result.name);
            if (result.evidence && result.evidence.toLocaleLowerCase().indexOf("http") === 0) {
                $("#search_result").html("Evidence: <a target='_blank' href='" + result.evidence + "'>" + result.evidence + "</a>");
            } else {
                $("#search_result").text("Evidence: " + result.evidence);
            }

            $("#search_result_author").text(result.author);

            $(".result_success").removeClass("hide");
            $(".result_success").removeClass("result_error");
            $(".result_success .author").removeClass("hide");
        } else {        //"error message"
            $(".add_banner").addClass("hide");
            $(".result_fail").addClass("hide");

            $("#search_banner").text($("#search_value").val());
            $("#search_result").text(result || resp.execute_err);
            $("#search_result_author").text("");

            $(".result_success").removeClass("hide");
            $(".result_success").addClass("result_error");
            $(".result_success .author").addClass("hide");
        }
    }
}


$("#add").click(function () {
    $(".result_fail").addClass("hide");
    $(".add_banner").removeClass("hide");
    $("#add_value").val("")
});

$(".example a").click(function () {
    $("#search_value").val($(this).attr("href"));
    $("#search").trigger("click");
    return false;
});



var txHash;

$("#push").click(function () {
    if (!$("#search_value").val().trim().length || !$("#add_name").val().trim().length || !$("#add_evidence").val().trim().length) {
        alert("Please input all values!");
        return;
    }
    var to = dappAddress;
    var value = "0";
    var callFunction = "save";
    var searchValue = $("#search_value").val();
    var callArgs = "[\"" + searchValue + "\",\"" + $("#add_name").val() + "\",\"" + $("#add_evidence").val() + "\"]";

    nebPay.call(to, value, callFunction, callArgs, {
        listener: cbPush
    });

    intervalQuery = setInterval(function () {
        funcIntervalQuery(searchValue);
    }, 15000); // big value to avoid such error you are queried more than 6 times per minute, please wait
});

var intervalQuery;

function funcIntervalQuery(searchValue) {
    if (!txHash) {
        return;
    }
    // this way will work in local/Testnet/Mainnet at same time
    neb.api.getTransactionReceipt({hash: txHash}).then(function (resp) {
        console.log(new Date() + " tx receipt result: " + JSON.stringify(resp));  //resp is a JSON string
        if (resp && resp.status === 1) {
            txHash = null;
            $("#add_name").val('');
            $("#add_evidence").val('');
            $(".add_banner").addClass("hide");
            clearInterval(intervalQuery);
            alert("Set information for hospital " + searchValue + " succeed!");
        }
    }).catch(function (err) {
        console.error(err);
    });
}

function cbPush(resp) {
    console.log("response of add: " + JSON.stringify(resp));
    txHash = resp.txhash;
}
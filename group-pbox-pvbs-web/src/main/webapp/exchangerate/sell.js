var primaryCcyCode;

$(function(){
	getPrimaryCcyCode();
	addOption();
});

$(document).ready(function() {
    $('#sellForm').bootstrapValidator({
		message: 'This value is not valid',

        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	accountNumber: {
        		group: '.group',
        		validators: {
                    notEmpty: {
                        message: 'please input account numeber'
                    },
                    regexp: {
                        regexp: /^[0-9]{12}$/,
                        message: 'the length should be 12.'
                    },
                  
                }
            },
            
            currency: {
        		group: '.group',
        		validators: {
                    notEmpty: {
                        message: 'please choose a currency'
                    }
                }
            },

  
            amount: {
                group: '.group',
				validators: {
                    notEmpty: {
                        message: 'please input amount.'
                    },
                    regexp: {
                        regexp: /^(\+\d+|\d+|\d+\.\d+|\+\d+\.\d+)$/,
                        message: 'exchange amount should be a number.'
                    }
                }
            }

        }
    }).on('success.form.bv', function(e) {
            // Prevent submit form
            e.preventDefault();
            var $form     = $(e.target);
                validator = $form.data('bootstrapValidator');
            if(validator){
            	sell(e.target);
            }

        });
});

function getPrimaryCcyCode() {
	var sysConfReq = {
		'item' : 'Primary_Ccy_Code'
	}

	$.ajax({
		url : contextPath+"/service/sysconf/getSysConfList",
		type : "post",
		async:false,
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(sysConfReq),
		success : function(response) {
			if (response.result == 00000) {
				primaryCcyCode = response.listData[0].value;
			} 
		}
	});

}

function sell(e){
	$('#sellForm').find('.alert-success').hide();
	$('#sellForm').find('.alert-warning').hide();
	
	var accountNumber = $("#accountNumber").val();
	var amount = $("#amount").val();
	var currency = $("#currency").val();
	var json = {'operationCode':'S','acctNumber': accountNumber, 'changeAmount' :amount,'currencyCode' : currency,'userId':'0001'};

	$.ajax({
			url : contextPath+"/service/ccyExRate/getCcyExRate",
			type : "post",
			contentType: "application/json",
			dataType : "json",
			data : JSON.stringify(json),
			success : function(response) {
				if (response.result=="00000") {
					//$('#buyForm').find('.alert-success').html('buy success.').show();
					$('#sellForm').find('.alert-success').html('You have sell successfully').show();
				}
				else {
					//$('#buyForm').find('.alert-warning').html('buy error.').show();
					$('#sellForm').find('.alert-warning').html($.errorHandler.prop(response.errorCode[0])).show();
					//$("#showResult").text(response.errorCode);
					if (response.errorCode[0] == "10021")
					{
						location.href=contextPath+"/login.html";
					}
					$('#sellForm').find('.alert-warning').html($.errorHandler.prop(response.errorCode[0])).show();
				}
			}
		});
}

function addOption(){
	var currency = {
			'operationCode': 'FAC'
		};
	$.ajax({
		url : contextPath+"/service/ccyExRate/getCcyExRate",
		type : "post",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(currency),
		success : function(response) {
			if (response.result == 00000) {			
				for(var i = 0; i<response.listData.length; i++){
					$("#currency").append("<option value='"+response.listData[i].currencyCode+"'>"+response.listData[i].currencyCode+"</option>");
				}

				$("#currency option[value=" + primaryCcyCode + "]").remove();
			} 
		}
	});
}
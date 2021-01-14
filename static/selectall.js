console.log('The selectall.js file works');

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
        return true;
}

function selectAllBoxes() {
    console.log('The selectAllBoxes function works');
    checkboxes = document.getElementsByName('checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}

function deselectAllBoxes() {
    console.log('The deselectAllBoxes function works');
    var checkboxes = document.getElementsByName('checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}

var mainCheckbox = document.getElementById('main-checkbox');
if (mainCheckbox) {
    mainCheckbox.addEventListener('click',
        function() {
            if(this.checked) {
                selectAllBoxes();
            }
            else {
                deselectAllBoxes();
            }
        }
    );
}

var deleteButton = document.getElementById('del-button');
if (deleteButton) {
    deleteButton.addEventListener('click',
    function() {

        var checkBoxes = document.getElementsByName('checkbox');
        console.log('CheckBoxes: ');
        console.log(checkBoxes);

        var tickedboxesObj = {};

        // Store ticked checkboxes in object
        for (var i = 0; i < checkBoxes.length; i++) {
            // console.log('In checkBoxes for loop');
            if (checkBoxes[i].checked == true) {
                // console.log('In if statement');
                tickedboxesObj['checkbox' + i] = checkBoxes[i].value;
                // console.log('tickedboxesObj ' + tickedboxesObj['checkbox' + i]);
            }
        }
        console.log('tickedboxesObj keys: ' + Object.keys(tickedboxesObj));
        console.log('tickedboxesObj values: ' + Object.values(tickedboxesObj));


        if (isEmpty(tickedboxesObj)) {
            alert('No records have been selected');
        }
        else {
            var confirmDelete = confirm('Are you sure you would like to delete the selected records?');
            console.log('Confirm delete: ' + confirmDelete);

            if (confirmDelete == true) {

                // Convert the object to a JSON string
                var myJsonString = JSON.stringify(tickedboxesObj);
                console.log(myJsonString);

                // Post JSON to local server for Python usage
                $(document).ready(function(){
                    console.log('Inside jQuery function');
                    // console.log(myJsonString);
                    // console.log(typeof myJsonString)
                    $.ajax({
                        type: 'POST',
                        url: '/postmethod',
                        data: myJsonString,
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function(response) {
                            console.log('AJAX success response: ');
                            console.log(response); // not being logged
                        },
                        error: function(error) {
                            console.log('AJAX error response: ');
                            console.log(error);
                        }
                    });
                });
            }
        }
    });
}

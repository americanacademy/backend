// INIT
// Define global variables

mode = '';
_key = '';

// Begin adding listeners once the document is finished loading
$(document).ready(function(){

	/*These functions define the input button behavior,
	  Make the corresponding fields visible and rewrite the name*/
	function addOrgMode(){
		resetForm();
		$('#org_fields').show();
		$('#org_name').html('Add Organization');
		$('#collab_name').html('');
		$('#select_org_members, #select_collab_members').hide();
		$('#org_fields input').prop('disabled', false);
	};

	function editOrgMode(){
		resetForm();
		$('#org_name').html('Edit Organization');
		$('#collab_name').html('');
		$('#select_org').show();
		$('#select_collab').hide();
		$('#select_org_members, #select_collab_members').show();
		$('#org_fields input').prop('disabled', false);
	};

	function remOrgMode(){
		resetForm();
		$('#org_name').html('Remove Organization');
		$('#collab_name').html('');
		$('#select_org').show();
		$('#select_collab').hide();
		$('#select_org_members, #select_collab_members').show();
		$('#org_fields input').prop('disabled', true);
	};

	function addCollabMode(){
		resetForm();	
		$('#collab_fields').show();
		$('#collab_name').html('Add Collaboration');
		$('#org_name').html('');
		$('#select_org_members, #select_collab_members').hide();
		$('#collab_fields input').prop('disabled', false);
	};

	function editCollabMode(){
		resetForm();
		$('#collab_name').html('Edit Collaboration');
		$('#org_name').html('');
		$('#select_collab').show()
		$('#select_org').hide();
		$('#select_org_members, #select_collab_members').show();
		$('#collab_fields input').prop('disabled', false);
	};

	function remCollabMode(){
		resetForm();
		$('#collab_name').html('Remove Collaboration');
		$('#org_name').html('');
		$('#select_collab').show();
		$('#select_org').hide();
		$('#select_org_members, #select_collab_members').show();
		$('#collab_fields input').prop('disabled', true);
	};

	/************************************************************************/


	//Update Firebase on click submission. It might be cleaner to at one point split
	//	'mode' into two variables, one 'entity_type' chosen from{'org', 'collab'}, one
	//	'editing_type' chosen from {'add', 'edit', 'remove'}, since functions like this 
	//	have such parallel structure.
	function submitClick(){
		var firebaseRef = new Firebase("https://test-for-atlas.firebaseio.com/");
		switch (mode){
			case "add_org":
			// Push new organization directly to database
				var newOrg = createOrganizationObject();
				firebaseRef.child('entity').push(newOrg);
				break;
			case "edit_org":
			// Update entity table based only on text field values, 
			//	updating organization entity links depends on global var
			//	_key being set to the org key.
				var newOrg = createOrganizationObject();
				firebaseRef.child('entity').child(_key).set(newOrg);
				editOrgUpdateEntityLinks();
				break;
			case "rem_org":
			// As above, remOrgUpdateEntityLinks() depends on correct global _key
				if (confirm("Do you really want to delete this organization?")){
					firebaseRef.child('entity').child(_key).remove();
					remOrgUpdateEntityLinks();
				}
				break;
			case "add_collab":
			// Collaboration procedures have different internal functions, but the
			//	structure in the scope of this function is identical.
				var newCollab = createCollaborationObject();
				firebaseRef.child('entity').push(newCollab);
				break;
			case "edit_collab":
				var newCollab = createCollaborationObject();
				firebaseRef.child('entity').child(_key).set(newCollab);
				editCollabUpdateEntityLinks();
				break;
			case "rem_collab":
				if (confirm("Do you really want to delete this collaboration?")){
					firebaseRef.child('entity').child(_key).remove();
					remCollabUpdateEntityLinks();
				}
				break;
			default: 
				// This happens if the user tries to select and change an entity
				// 	without selecting a mode first.
				window.alert("Please select an editing mode!");
				break;
		};
		// Once the submit button has been clicked, clear the form and reset Firebase
		resetForm();
		initializeFirebase(firebaseRef);
		mode = ''
	};

	/*********************************************************/
	// submitClick() helper functions

	// These two functions are overly long, and they rely on hardcoding in the first names.
	// There is a better way to implement this, such as in fillOrgFields() and fillCollabFields()
	// 	using JQuery matching. This is adequately fast, however
	// TODO: Implement JQuery matching for these function
	function createOrganizationObject(){
		var newOrg = {
			abbreviations_for_collaborations_only 				: "",
			about 												: $('#org_fields #about').val(),
			address_1 											: $('#org_fields #address_1').val(),
			city 												: $('#org_fields #city').val(),
			collaboration_participation_membership_verified_by 	: "",
			contact 											: $('#org_fields #contact').val(),
			entity_category 									: $('#org_fields #entity_category').val(),
			entity_category_info 								: $('#org_fields #entity_category_info').val(),
			entity_name											: $('#org_fields #entity_name').val(),
			entity_type											: "organization",
			facebook											: $('#org_fields #facebook').val(),
			fortune_status										: $('#org_fields #fortune_status').val(),
			founding_year_for_collaborations_only				: "",
			geolocation											: $('#org_fields #geolocation').val(),
			has_linked_records									: $('#org_fields #has_linked_records').is(":checked"),
			has_resources										: false,
			linkedin_company_page								: $('#org_fields #linkedin_company_page').val(),
			linkedin_groups										: $('#org_fields #linkedin_groups').val(),
			organization_links									: "",
			participation_membership_in_collaboration			: "",
			primary_focus										: $('#org_fields #primary_focus').val(),
			state												: $('#org_fields #state').val(),
			status												: $('#org_fields #status').val(),
			twitter												: $('#org_fields #twitter').val(),
			updated_date										: currentDate(),
			washington_dc_office								: $('#org_fields #washington_dc_office').val(),
			website												: $('#org_fields #website').val(),
			youtube												: $('#org_fields #youtube').val(),
			zip													: $('#org_fields #zip').val(),
		};
		return newOrg;
	};

	
	function createCollaborationObject(){
		var newCollab = {
			abbreviations_for_collaborations_only 				: $('#collab_fields #abbreviations_for_collaborations_only').val(),
			about 												: $('#collab_fields #about').val(),
			address_1 											: $('#collab_fields #address_1').val(),
			city 												: $('#collab_fields #city').val(),
			collaboration_participation_membership_verified_by 	: $('#collab_fields #collaboration_participation_membership_verified_by').val(),
			contact 											: $('#collab_fields #contact').val(),
			entity_category 									: $('#collab_fields #entity_category').val(),
			entity_category_info 								: $('#collab_fields #entity_category_info').val(),
			entity_name											: $('#collab_fields #entity_name').val(),
			entity_type											: "collaboration",
			facebook											: $('#collab_fields #facebook').val(),
			fortune_status										: "",
			founding_year_for_collaborations_only				: $('#collab_fields #founding_year_for_collaborations_only').val(),
			geolocation											: "",
			has_linked_records									: $('#collab_fields #has_linked_records').is(":checked"),
			has_resources										: $('#collab_fields #has_resources').is(":checked"),
			linkedin_company_page								: $('#collab_fields #linkedin_company_page').val(),
			linkedin_groups										: $('#collab_fields #linkedin_groups').val(),
			organization_links									: "",
			participation_membership_in_collaboration			: "",
			primary_focus										: $('#collab_fields #primary_focus').val(),
			state												: $('#collab_fields #state').val(),
			status												: $('#collab_fields #status').val(),
			twitter												: $('#collab_fields #twitter').val(),
			updated_date										: currentDate(),
			washington_dc_office								: $('#collab_fields #washington_dc_office').val(),
			website												: $('#collab_fields #website').val(),
			youtube												: $('#collab_fields #youtube').val(),
			zip													: $('#collab_fields #zip').val(),
		};
		return newCollab;
	};
	
	/* These functions have a live Firebase within them to make changes.
	   Editing and removing organization links is more difficult because of the structure of
	   'entity-membership': 	collab-key => [member-key1, member-key2, member-key3]

	*/
	function editOrgUpdateEntityLinks(){
		// Gets the currently selected collaborations for the organization as an array of keys.
		memberOf = $('.chosen#org_members').val();
		if (memberOf){
			var firebaseRef = new Firebase("https://test-for-atlas.firebaseio.com/");
			// firebaseRef.once() will only trigger and perform the internal operations once.
			firebaseRef.child('entity-membership').once("value", function(snapshot){
				// data is the entity membership table as a JSON object
				data = snapshot.val();
				// For every key that the organization should be associated with
				for (var i = 0; i < memberOf.length; i++) {
					// If that key is in the entity membership table and the organization is 
					//	NOT already associated with that key, then add the org-key to the main table.
					if (data.hasOwnProperty(memberOf[i]) && !isInArray(_key, data[memberOf[i]])){
						data[memberOf[i]].push(_key);
					}
				}
				// Update with new data.
				firebaseRef.child('entity-membership').update(data);
			});
		}
		else{
			// If the org is not a member anywhere, just remove it from everything.
			remOrgUpdateEntityLinks();
		}
	}

	function editCollabUpdateEntityLinks(){
		// Gets the current members for this organization as an array
		members = $('.chosen#collab_members').val();
		if (!members){
			members = [];
		};
		var firebaseRef = new Firebase("https://test-for-atlas.firebaseio.com/");
		// Update Firebase's ref for this collaboration key to be the member array.
		firebaseRef.child('entity-membership').child(_key).set(members);
	}

	function remOrgUpdateEntityLinks(){
		// To remove an org, we just remove its key from everywhere.
		var firebaseRef = new Firebase("https://test-for-atlas.firebaseio.com/");
		firebaseRef.child('entity-membership').once("value", function(snapshot){
			data = snapshot.val();
			for (var key in data){
				// data.hasOwnProperty(key) check prevents primitive Object properties from mattering
				if (data.hasOwnProperty(key) && isInArray(_key, data[key])){
					// This pops the key from the array.
					var index = data[key].indexOf(_key);
					if (index > -1) {
						data[key].splice(index, 1);
					}
				}
			}
			firebaseRef.child('entity-membership').update(data);
		});
	}

	function remCollabUpdateEntityLinks(){
		// To remove a collab, we clear it and its array from the database. 
		var firebaseRef = new Firebase("https://test-for-atlas.firebaseio.com/");
		firebaseRef.child('entity-membership').child(_key).remove();
	}



	/***************************************************************/
	// Chosen-selects to choose which organization or collaboration to edit/remove

	function populateOrgSelect(data){
		// data passed in is the whole Firebase object, this is necessary for the linkages after
		//	top level selection.
		entities = data['entity'];
		tempString ='Select Organization ';
		tempString += '<select class="chosen" data-placeholder="Choose an organization..." id="org">';

		for (var key in entities) {
			if (entities.hasOwnProperty(key)) {
				// Add every organization to the select, and make the selection value the organization key
				if (entities[key].entity_type == 'organization'){
					tempString += '<option value="' + key + '">' + entities[key].entity_name + "</option>";
				}
			}
		}

		tempString += '</select>';
		// Set the inner html of #select_org div to this newly build select.
		$('#select_org').html(tempString);
		// Make this new select a chosen object, with static width (without static width, it breaks)
		//	and becomes extremely thin so you cannot see the options. When you choose an option, perform
		//	the function.
		$('.chosen#org').chosen({width: "95%"}).change(function(){
			// set global key variable to be the currently chosen organization
			//	intended so that every time a new org or collab is chosen to be actively worked on
			//	the _key variable also updates and so accurately tracks the current working object.
			_key = $('.chosen#org').val();
			// console.log($('.chosen#org').val());
			// This does the main duty of filling the fields
			// Value passed is an entity, type is organization
			fillOrgFields(entities[$('.chosen#org').val()]);
			// This fills the organization's membership in collaborations.
			loadOrganizationMembershipSelect(data);
		});
	};

	function populateCollabSelect(data){
		// Code same as in above function. TODO: see how to reuse code.
		entities = data['entity'];
		tempString ='Select Collaboration ';
		tempString += '<select class="chosen" data-placeholder="Choose a collaboration..." id="collab">';
		for (var key in entities) {
			if (entities.hasOwnProperty(key)) {
				if (entities[key].entity_type == 'collaboration'){
					tempString += '<option value="' + key + '">' + entities[key].entity_name + "</option>";
				}
			}
		}

		tempString += '</select>';
		$('#select_collab').html(tempString);
		$('.chosen#collab').chosen({width: "95%"}).change(function(){
			_key = $('.chosen#collab').val();
			// console.log($('.chosen#collab').val());
			// Value passed is an entity, type is collaboration
			fillCollabFields(entities[$('.chosen#collab').val()]);
			loadCollaborationMembershipSelect(data);
		});
	};

	function fillOrgFields(organization){
		//For every text field, get the text field ID, find the organization value that matches
		// 	to that key, and set that value to the text field input. Then do checkboxes.
		$('#org_fields input:text').each(function(){
			$(this).val(organization[$(this).attr('id')]);
		});
		$('#org_fields input:checkbox').each(function(){
			$(this).prop('checked', organization[$(this).attr('id')]);
		});
		$('#org_fields').show();
	};

	function fillCollabFields(collaboration){
		//Same as above.
		$('#collab_fields input:text').each(function(){
			$(this).val(collaboration[$(this).attr('id')]);
		});
		$('#collab_fields input:checkbox').each(function(){
			$(this).prop('checked', collaboration[$(this).attr('id')]);
		});
		$('#collab_fields').show();
	};

	//ENTITY MEMBERSHIP AND LINKAGE FUNCTIONS

	//Load a multiple select of collaborations, with collaborations that the
	//	organization is already part of preselected.
	function loadOrganizationMembershipSelect(data){
		orgKey = _key;
		entities = data['entity']
		preselectKeys = getCollabKeysForOrg(orgKey, data['entity-membership']);
		tempString = 'Membership participation in collaborations: ';
		tempString += '<select class="chosen" multiple = "true" data-placeholder="Choose an organization..." id="org_members">';
		for (var key in entities){
			if (entities.hasOwnProperty(key)){
				if (entities[key].entity_type == 'collaboration'){
					if (preselectKeys && isInArray(key, preselectKeys)){
						// Select only collaborations, and select values whose keys are in preselectKeys
						tempString += '<option selected = "true" value="' + key + '">' + entities[key].entity_name + "</option>";
					}
					else{
						tempString += '<option value="' + key + '">' + entities[key].entity_name + "</option>";
					}
				}
			}
		}
		tempString += '</select>';
		// Set the select div's html to be the new select box string
		$('#select_org_members').html(tempString);
		// Initialize chosen
		$('.chosen#org_members').chosen();
	};


	function loadCollaborationMembershipSelect(data){
		collabKey = _key;
		entities = data['entity']
		preselectKeys = getEntityKeysForCollab(collabKey, data['entity-membership']);
		tempString = 'Collaboration members: ';
		tempString += '<select class="chosen" multiple = "true" data-placeholder="Choose an organization/collaboration..." id="collab_members">';
		for (var key in entities){
			if (entities.hasOwnProperty(key)){
				// Select every entity. If preselectKeys exists and key is in preselectKeys, automatically select the entity.
				if (preselectKeys && isInArray(key, preselectKeys)){
					tempString += '<option selected = "true" value="' + key + '">' + entities[key].entity_name + "</option>";
				}
				else{
					tempString += '<option value="' + key + '">' + entities[key].entity_name + "</option>";
				}
			}
		}
		tempString += '</select>';
		// Set the select div's html to be the new select box string
		$('#select_collab_members').html(tempString);
		// Initialize chosen
		$('.chosen#collab_members').chosen();
		// What does this line do? I should'a commented this last night
		$('.chosen#collab_members').prop('disabled', false);
	};

	// Given an organization key and the membership table, return an array of collaboration keys
	//	of which the organization is part.
	function getCollabKeysForOrg(orgKey, membership_table){
		collabKeys = [];
		for (var key in membership_table){
			if (membership_table.hasOwnProperty(key)) {
				// if the org is in the current array for the membership table,
				//	add the membership table array's key to the list of valid collab keys
				if (isInArray(orgKey, membership_table[key])){
					collabKeys.push(key);
				}
			}
		};
		return collabKeys;
	};

	// Given a collaboration key and the membership table, return an array of entity keys
	//	that are part of the collaboration.
	function getEntityKeysForCollab(collabKey, membership_table){
		for (var key in membership_table){
			if (membership_table.hasOwnProperty(key)) {
				if (key == collabKey){
					// return the current array of members
					return membership_table[key];
				};
			}
		};
	};





	/*************************************************************************************/
	/*Utilities and frequently used*/

	//Remove text from all input fields.
	function clearFields(){
		// Empty fields
		$('input:text').val('');
		// Clear checkboxes
		$('input:checkbox').prop('checked', false);
		// Clear name
		$('#org_name, #collab_name').html('');
	};

	//Hide all fields
	function hideFields(){
		$('#org_fields, #collab_fields').hide();
		$('#select_org, #select_collab').hide();
	};

	function resetForm(){
		clearFields();
		hideFields();
	}

	// Utility function, check if value in array, return boolean
	function isInArray(value, array) {
  		return array.indexOf(value) > -1;
	};

	//Thanks to StackExchange user Samuel Meddows
	function currentDate(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd = '0'+dd
		};

		if(mm<10) {
		    mm = '0'+mm
		};

		today = mm + '/' + dd + '/' + yyyy;
		return today;
	};




	//INITIALIZE FIREBASE
	var firebaseRef = new Firebase("https://test-for-atlas.firebaseio.com/");

	// This can be sped up if need be by listening only to updates to
	//	mainFirebase.child('entity'), and separating entity-membership behavior.
	function initializeFirebase(mainFirebase){
		// See if this is necessary
		var entities = {};
		// On function runs every time data is updated
		mainFirebase.on("value", function(snapshot){
			// When data is loaded, create the Org and Collab select tools.
			data = snapshot.val();
			populateOrgSelect(data);
			populateCollabSelect(data);
		});
	};

	initializeFirebase(firebaseRef);

	// For some reason, having a single ID for org and collab submitButton and cancelButton does not work
	// TODO: Identify if the problem is with jQuery matching or something else.
	$("#org_submitButton").click(function(){
		submitClick();
	});

	$("#org_cancelButton").click(function(){
		resetForm();
	});

	$("#collab_submitButton").click(function(){
		submitClick();
	});

	$("#collab_cancelButton").click(function(){
		resetForm();
	});

	// For each button, set the mode appropriately. 
	// TODO: Use item IDs to centralize these 6 into one function.
	$("#add_org").click(function(){
		if(mode != 'add_org'){
			mode = 'add_org';
			addOrgMode();
		}
	});
	$("#edit_org").click(function(){
		if(mode != 'edit_org'){
			mode = 'edit_org';
			editOrgMode();
		}
	});
	$("#rem_org").click(function(){
		if(mode != 'rem_org'){
			mode = 'rem_org';
			remOrgMode();
		}
	});
	$("#add_collab").click(function(){
		if(mode != 'add_collab'){
			mode = 'add_collab';
			addCollabMode();
		}
	});
	$("#edit_collab").click(function(){
		if(mode != 'edit_collab'){
			mode = 'edit_collab';
			editCollabMode();
		}
	});
	$("#rem_collab").click(function(){
		if(mode != 'rem_collab'){
			mode = 'rem_collab';
			remCollabMode();
		}
	});
});
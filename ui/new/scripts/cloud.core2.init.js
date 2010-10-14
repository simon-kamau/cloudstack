$(document).ready(function() {  
    function expandFirstLevelMenu($firstLevelMenu, $secondLevelMenu) {
        $firstLevelMenu.find("#expandable_first_level_arrow").removeClass("close").addClass("open");
        $firstLevelMenu.addClass("highlighted");
        $expandedFirstLevelMenu = $firstLevelMenu;
        $secondLevelMenu.show();
        $expandedSecondLevelMenu = $secondLevelMenu;
    }
    
    function collapseFirstLevelMenu($firstLevelMenu, $secondLevelMenu) {
        $firstLevelMenu.find("#expandable_first_level_arrow").removeClass("open").addClass("close");
        $firstLevelMenu.removeClass("highlighted");
        $secondLevelMenu.hide();  
    }
 
    $("#leftmenu_container").find("#expandable_first_level").bind("click", function(event) {       
        var $firstLevelMenu = $(this);
        var $secondLevelMenu = $firstLevelMenu.siblings(".leftmenu_expandedbox");
        if($secondLevelMenu.css("display") == "none") {
            if($expandedFirstLevelMenu != null && $expandedSecondLevelMenu != null)  //collapse other expanded menu if there is.
                collapseFirstLevelMenu($expandedFirstLevelMenu, $expandedSecondLevelMenu);  
            expandFirstLevelMenu($firstLevelMenu, $secondLevelMenu);  
        }
        else {
            collapseFirstLevelMenu($firstLevelMenu, $secondLevelMenu);           
        }          
        return false;
    });
    $("#leftmenu_container").show();
       
    var $midmenuItem = $("#midmenu_item");
    function listMidMenuItems(leftmenuId, commandString, jsonResponse1, jsonResponse2, rightPanelJSP, afterLoadRightPanelJSPFn, toMidmenuFn, toRightPanelFn, getMidmenuIdFn) { 
        $("#"+leftmenuId).bind("click", function(event) {
            selectLeftMenu($(this));
            
            showMiddleMenu();
            disableMultipleSelectionInMidMenu();
            
            clearLeftMenu();
            clearMiddleMenu();
            
            $("#right_panel").load(rightPanelJSP, function(){                   
                $("#right_panel_content #tab_content_details #action_message_box #close_button").bind("click", function(event){    
                    $(this).parent().hide();
                    return false;
                });  
                                     
                var $actionLink = $("#right_panel_content #tab_content_details #action_link");
	            $actionLink.bind("mouseover", function(event) {	    
                    $(this).find("#action_menu").show();    
                    return false;
                });
                $actionLink.bind("mouseout", function(event) {       
                    $(this).find("#action_menu").hide();    
                    return false;
                });	   
                              
                afterLoadRightPanelJSPFn();    
                            
                $.ajax({
	                cache: false,
	                data: createURL("command="+commandString+"&pagesize="+midmenuItemCount),
	                dataType: "json",
	                success: function(json) {		                    
	                    selectedItemsInMidMenu = {};    	                
	                    var items = json[jsonResponse1][jsonResponse2];
	                    if(items != null && items.length > 0) {
	                        for(var i=0; i<items.length;i++) { 
                                var $midmenuItem1 = $midmenuItem.clone();  
                                $midmenuItem1.data("toRightPanelFn", toRightPanelFn);                             
                                toMidmenuFn(items[i], $midmenuItem1);    
                                bindClickToMidMenu($midmenuItem1, toRightPanelFn, getMidmenuIdFn);             
                                $("#midmenu_container").append($midmenuItem1.show());   
                                if(i == 0)  //click the 1st item in middle menu as default 
                                    $midmenuItem1.click();                        
                            }  
                        }  
	                }
		        });	 
            });     
            return false;
        });
    }
    listMidMenuItems("leftmenu_event", "listEvents", "listeventsresponse", "event", "jsp/event.jsp", afterLoadEventJSP, eventToMidmenu, eventToRigntPanel, getMidmenuId);
    listMidMenuItems("leftmenu_alert", "listAlerts", "listalertsresponse", "alert", "jsp/alert.jsp", afterLoadAlertJSP, alertToMidmenu, alertToRigntPanel, getMidmenuId);
    listMidMenuItems("leftmenu_account", "listAccounts", "listaccountsresponse", "account", "jsp/account.jsp", afterLoadAccountJSP, accountToMidmenu, accountToRigntPanel, getMidmenuId);
    listMidMenuItems("leftmenu_volume", "listVolumes", "listvolumesresponse", "volume", "jsp/volume.jsp", afterLoadVolumeJSP, volumeToMidmenu, volumeToRigntPanel, getMidmenuId);
    listMidMenuItems("leftmenu_snapshot", "listSnapshots", "listsnapshotsresponse", "snapshot", "jsp/snapshot.jsp", afterLoadSnapshotJSP, snapshotToMidmenu, snapshotToRigntPanel, getMidmenuId);
    listMidMenuItems("leftmenu_ip", "listPublicIpAddresses", "listpublicipaddressesresponse", "publicipaddress", "jsp/ipaddress.jsp", afterLoadIpJSP, ipToMidmenu, ipToRigntPanel, ipGetMidmenuId);
    //listMidMenuItems("leftmenu_router", "listRouters", "listroutersresponse", "router", "jsp/router.jsp", afterLoadRouterJSP, routerToMidmenu, routerToRigntPanel, getMidmenuId);
      
    listMidMenuItems("leftmenu_submenu_my_template", "listTemplates&templatefilter=self", "listtemplatesresponse", "template", "jsp/template.jsp", afterLoadTemplateJSP, templateToMidmenu, templateToRigntPanel, templateGetMidmenuId);
    listMidMenuItems("leftmenu_submenu_featured_template", "listTemplates&templatefilter=featured", "listtemplatesresponse", "template", "jsp/template.jsp", afterLoadTemplateJSP, templateToMidmenu, templateToRigntPanel, templateGetMidmenuId);
    listMidMenuItems("leftmenu_submenu_community_template", "listTemplates&templatefilter=community", "listtemplatesresponse", "template", "jsp/template.jsp", afterLoadTemplateJSP, templateToMidmenu, templateToRigntPanel, templateGetMidmenuId);
    
    listMidMenuItems("leftmenu_submenu_my_iso", "listIsos&isofilter=self", "listisosresponse", "iso", "jsp/iso.jsp", afterLoadIsoJSP, isoToMidmenu, isoToRigntPanel, isoGetMidmenuId);
    listMidMenuItems("leftmenu_submenu_featured_iso", "listIsos&isofilter=featured", "listisosresponse", "iso", "jsp/iso.jsp", afterLoadIsoJSP, isoToMidmenu, isoToRigntPanel, isoGetMidmenuId);
    listMidMenuItems("leftmenu_submenu_community_iso", "listIsos&isofilter=community", "listisosresponse", "iso", "jsp/iso.jsp", afterLoadIsoJSP, isoToMidmenu, isoToRigntPanel, isoGetMidmenuId);
    
    listMidMenuItems("leftmenu_service_offering", "listServiceOfferings", "listserviceofferingsresponse", "serviceoffering", "jsp/serviceoffering.jsp", afterLoadServiceOfferingJSP, serviceOfferingToMidmenu, serviceOfferingToRigntPanel, getMidmenuId); 
    listMidMenuItems("leftmenu_disk_offering", "listDiskOfferings", "listdiskofferingsresponse", "diskoffering", "jsp/diskoffering.jsp", afterLoadDiskOfferingJSP, diskOfferingToMidmenu, diskOfferingToRigntPanel, getMidmenuId); 
    listMidMenuItems("leftmenu_global_setting", "listConfigurations", "listconfigurationsresponse", "configuration", "jsp/globalsetting.jsp", afterLoadGlobalSettingJSP, globalSettingToMidmenu, globalSettingToRigntPanel, globalSettingGetMidmenuId, getMidmenuId); 
        
    $("#leftmenu_instance_group_header").bind("click", function(event) {  
        showMiddleMenu();
        clearMiddleMenu();          
        enableMultipleSelectionInMiddleMenu();  //multiple-selection is needeed for actions like start VM, stop VM, reboot VM.
        var $arrowIcon = $(this).find("#arrow_icon");        
        clickInstanceGroupHeader($arrowIcon);
        return false;
    });
    
    $("#leftmenu_dashboard").bind("click", function(event) {  
        selectLeftMenu($(this));
            
        hideMiddleMenu();
        $("#right_panel").load("jsp/dashboard.jsp", function(){
            afterLoadDashboardJSP();        
        });
        return false;
    });
    
    $("#leftmenu_domain").bind("click", function(event) {  
        selectLeftMenu($(this));
        
        showMiddleMenuWithoutSearch();
        disableMultipleSelectionInMidMenu();
        
        clearLeftMenu();
        clearMiddleMenu();
        
        $("#right_panel").load("jsp/domain.jsp", function(){ 
            afterLoadDomainJSP();       
        });     
        return false;
    });
    
    $("#leftmenu_resource").bind("click", function(event) {  
        buildZoneTree();
        selectLeftMenu($(this));
        
        showMiddleMenuWithoutSearch();
        disableMultipleSelectionInMidMenu();
        
        clearLeftMenu();
        clearMiddleMenu();
                
        $("#right_panel").load("jsp/resource.jsp", function(){ 
            afterLoadResourceJSP();       
        });     
                
        return false;
    });
    
    function buildZoneTree() {        
        $zoneTree = $("#leftmenu_zone_tree").empty();
        
        var $zoneNode = $("#leftmenu_zone_node_template").clone();
        $zoneTree.append($zoneNode.show());
        
        var $podNode = $("#leftmenu_pod_node_template").clone();
        $zoneTree.append($podNode.show());
        
        var $clusterNode = $("#leftmenu_cluster_node_template").clone();
        $zoneTree.append($clusterNode.show());
        
        var $systemvmNode = $("#leftmenu_systemvm_node_template").clone();
        $zoneTree.append($systemvmNode.show());
    }
    
           
    $("#midmenu_action_link").bind("mouseover", function(event) {
        $(this).find("#action_menu").show();    
        return false;
    });
    $("#midmenu_action_link").bind("mouseout", function(event) {
        $(this).find("#action_menu").hide();    
        return false;
    });
    
    
    
    
   
	// Prevent the UI from being iframed if the iframe isn't from the same domain.
	try {
		if ( top != self && self.location.hostname != top.location.hostname) {
			// leaving the code here in the oft change an older browser is being used that does not have
			// cross-site scripting prevention.
			alert("Detected a frame (" + top.location.hostname + ") not from the same domain (" + self.location.hostname + ").  Moving app to top of browser to prevent any security tampering.");
			top.location.href = window.location.href;
		}
	} catch (err) {
		// This means the domains are different because the browser is preventing access to the parent's domain.
		alert("Detected a frame not from the same domain (" + self.location.hostname + ").  Moving app to top of browser to prevent any security tampering.");
		top.location.href = window.location.href;
	}

	// We don't support IE6 at the moment, so let's just inform customers it won't work
	var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
	var gteIE7 = false /*@cc_on || @_jscript_version >= 5.7 @*/;

	// Disable IE6 browsers as UI does not support it
	if (IE6 == true) {
		alert("Only IE7, IE8, FireFox 3.x, Chrome, and Safari browsers are supported at this time.");
		return;
	}
	
	/*
	initializeTestTool();
	*/
		
	// Default AJAX Setup
	$.ajaxSetup({
		url: "/client/api",
		dataType: "json",
		cache: false,
		error: function(XMLHttpResponse) {
			handleError(XMLHttpResponse);
		},
		beforeSend: function(XMLHttpRequest) {
			if (g_mySession == $.cookie("JSESSIONID")) {
				return true;
			} else {
				$("#dialog_session_expired").dialog("open");
				return false;
			}
		}		
	});
	
	// LOGIN/LOGOUT
	// 'Enter' Key in any login form element = Submit click
	$("#logoutpage #loginForm").keypress(function(event) {
		var formId = $(event.target).attr("id");
		if(event.keyCode == keycode_Enter && formId != "loginbutton") {
			login();
		}
	});
	
	$("#logoutpage .loginbutton").bind("click", function(event) {
		login();
		return false;
	});
	
	$("#logoutaccount_link").bind("click", function(event) {
		$.ajax({
		        data: createURL("command=logout&response=json"),
			dataType: "json",
			success: function(json) {
				logout(true);
			},
			error: function() {
				logout(true);
			},
			beforeSend : function(XMLHTTP) {
				return true;
			}
		});
	});
	
	// FUNCTION: logs the user out
	var activeTab = null;
	function logout(refresh) {
		g_mySession = null;
                g_sessionKey = null;
		g_username = null;	
		g_account = null;
		g_domainid = null;	
		g_timezoneoffset = null;
		g_timezone = null;
		
		$.cookie('JSESSIONID', null);
		$.cookie('sessionKey', null);
		$.cookie('username', null);
		$.cookie('account', null);
		$.cookie('domainid', null);
		$.cookie('role', null);
		$.cookie('networktype', null); 
		$.cookie('timezoneoffset', null);
		$.cookie('timezone', null);
		
		$("body").stopTime();
		
		// default is to redisplay the login page
		if (onLogoutCallback()) {
			if (refresh) {
				location.replace('/client');
				return false;
			}
			$("#account_password").val("");
			$(".loginbutton_box p").hide();
			$("#logoutpage").show();
			$("body").css("background", "#4e4e4e url(images/logout_bg.gif) repeat-x top left");			
			$("#mainmaster").hide();
			$("#overlay_black").hide();
			
			var menuOnClass = "menutab_on";
			var menuOffClass = "menutab_off";
			var tab = null;
			if (isAdmin()) {
				tab = $("#menutab_dashboard_root");
				menuOnClass = "admin_menutab_on";
				menuOffClass = "admin_menutab_off";
			} else if (isDomainAdmin()) {
				tab = $("#menutab_dashboard_domain");
				menuOnClass = "admin_menutab_on";
				menuOffClass = "admin_menutab_off";
			} else if (isUser()) {
				tab = $("#menutab_dashboard_user");
				menuOnClass = "menutab_on";
				menuOffClass = "menutab_off";
			}
			if (activeTab != null) {
				activeTab.removeClass(menuOnClass).addClass(menuOffClass);
				activeTab = null;
			}
			if (tab != null) {
				tab.removeClass(menuOffClass).addClass(menuOnClass);
			}
			g_role = null;
			$("#account_username").focus();
		}
	}
	
	// FUNCTION: logs the user in
	function login() {
		var array1 = [];
		var username = encodeURIComponent($("#account_username").val());
		array1.push("&username="+username);
		
		var password = $.md5(encodeURIComponent($("#account_password").val()));
		array1.push("&password="+password);
		
		var domain = encodeURIComponent($("#account_domain").val());
		if(domain != null && domain.length > 0)
		    array1.push("&domain="+domain);
		
		$.ajax({
			type: "POST",
		        data: createURL("command=login&response=json" + array1.join("")),
			dataType: "json",
			async: false,
			success: function(json) {
				g_mySession = $.cookie('JSESSIONID');
				g_sessionKey = encodeURIComponent(json.loginresponse.sessionkey);
				g_role = json.loginresponse.type;
				g_username = json.loginresponse.username;	
				g_account = json.loginresponse.account;
				g_domainid = json.loginresponse.domainid;	
				g_timezone = json.loginresponse.timezone;								
				g_timezoneoffset = json.loginresponse.timezoneoffset;					
				if (json.loginresponse.networktype != null) 
					g_networkType = json.loginresponse.networktype;				
				if (json.loginresponse.hypervisortype != null) 
					g_hypervisorType = json.loginresponse.hypervisortype;				
				if (json.loginresponse.directattachnetworkgroupsenabled != null) 
					g_directAttachNetworkGroupsEnabled = json.loginresponse.directattachnetworkgroupsenabled;
				if (json.loginresponse.directattacheduntaggedenabled != null) 
					g_directAttachedUntaggedEnabled = json.loginresponse.directattacheduntaggedenabled;
                if (json.loginresponse.systemvmuselocalstorage != null) 
					g_systemVmUseLocalStorage = json.loginresponse.systemvmuselocalstorage;
					
				$.cookie('sessionKey', g_sessionKey, { expires: 1});
				$.cookie('networktype', g_networkType, { expires: 1});
				$.cookie('hypervisortype', g_hypervisorType, { expires: 1});
				$.cookie('username', g_username, { expires: 1});	
				$.cookie('account', g_account, { expires: 1});	
				$.cookie('domainid', g_domainid, { expires: 1});				
				$.cookie('role', g_role, { expires: 1});
				$.cookie('timezoneoffset', g_timezoneoffset, { expires: 1});  
				$.cookie('timezone', g_timezone, { expires: 1});  
				$.cookie('directattachnetworkgroupsenabled', g_directAttachNetworkGroupsEnabled, { expires: 1}); 
				$.cookie('directattacheduntaggedenabled', g_directAttachedUntaggedEnabled, { expires: 1}); 
				$.cookie('systemvmuselocalstorage', g_systemVmUseLocalStorage, { expires: 1}); 
				
				// Set Role
				if (isUser()) {
					$(".loginbutton_box p").text("").hide();			
					$("#menutab_role_user #menutab_dashboard_user").click();
				} else if (isAdmin()) {
					$(".loginbutton_box p").text("").hide();			
					$("#menutab_role_root #menutab_dashboard_root").click();
				} else if (isDomainAdmin()) {
					$(".loginbutton_box p").text("").hide();			
					$("#menutab_role_domain #menutab_dashboard_domain").click();
				} else {
				    $(".loginbutton_box p").text("Account type of '" + username + "' is neither user nor admin.").show();
				    return;
				}				
				
				$("#logoutpage").hide();
				$("body").css("background", "#FFF repeat top left");
				$("#mainmaster").show();	
			},
			error: function() {
				$("#account_password").val("");
				$("#logoutpage").show();				
				$(".loginbutton_box p").text("Your username/password does not match our records.").show();
				$("#account_username").focus();
			},
			beforeSend: function(XMLHttpRequest) {
				return true;
			}
		});
	}
	
	// Dialogs
	$("#dialog_confirmation").dialog({ 
		autoOpen: false,
		modal: true,
		zIndex: 2000
	});
	
	$("#dialog_info").dialog({ 
		autoOpen: false,
		modal: true,
		zIndex: 2000,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});
	
	$("#dialog_alert").dialog({ 
		autoOpen: false,
		modal: true,
		zIndex: 2000,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});
	$("#dialog_alert").siblings(".ui-widget-header").css("background", "url('/client/css/images/ui-bg_errorglass_30_ffffff_1x400.png') repeat-x scroll 50% 50% #393939");
	$("#dialog_alert").siblings(".ui-dialog-buttonpane").find(".ui-state-default").css("background", "url('/client/css/images/ui-bg_errorglass_30_ffffff_1x400.png') repeat-x scroll 50% 50% #393939");
	
	$("#dialog_error").dialog({ 
		autoOpen: false,
		modal: true,
		zIndex: 2000,
		buttons: { "Close": function() { $(this).dialog("close"); } }
	});
	$("#dialog_error").siblings(".ui-widget-header").css("background", "url('/client/css/images/ui-bg_errorglass_30_ffffff_1x400.png') repeat-x scroll 50% 50% #393939");
	$("#dialog_error").siblings(".ui-dialog-buttonpane").find(".ui-state-default").css("background", "url('/client/css/images/ui-bg_errorglass_30_ffffff_1x400.png') repeat-x scroll 50% 50% #393939");
	
	$("#dialog_session_expired").dialog({ 
		autoOpen: false,
		modal: true,
		zIndex: 2000,
		buttons: { "OK": function() { logout(true); $(this).dialog("close"); } }
	});
	$("#dialog_session_expired").siblings(".ui-widget-header").css("background", "url('/client/css/images/ui-bg_errorglass_30_ffffff_1x400.png') repeat-x scroll 50% 50% #393939");
	$("#dialog_session_expired").siblings(".ui-dialog-buttonpane").find(".ui-state-default").css("background", "url('/client/css/images/ui-bg_errorglass_30_ffffff_1x400.png') repeat-x scroll 50% 50% #393939");
			
	$("#dialog_info_please_select_one_item_in_middle_menu").dialog({ 
		autoOpen: false,
		modal: true,
		zIndex: 2000,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});
			
	// Check whether the session is valid.
	g_mySession = $.cookie("JSESSIONID");
	g_sessionKey = $.cookie("sessionKey");
	g_role = $.cookie("role");
	g_username = $.cookie("username");
	g_account = $.cookie("account");
	g_domainid = $.cookie("domainid");
	g_networkType = $.cookie("networktype");
	g_hypervisorType = $.cookie("hypervisortype");
	g_timezone = $.cookie("timezone");
	g_directAttachNetworkGroupsEnabled = $.cookie("directattachnetworkgroupsenabled");
	g_directAttachedUntaggedEnabled = $.cookie("directattacheduntaggedenabled");
	g_systemVmUseLocalStorage = $.cookie("systemvmuselocalstorage");
	
	if($.cookie("timezoneoffset") != null)
	    g_timezoneoffset = isNaN($.cookie("timezoneoffset"))?null: parseFloat($.cookie("timezoneoffset"));
	else
	    g_timezoneoffset = null;
	    
	if (!g_networkType || g_networkType.length == 0) 		
		g_networkType = "vnet";
	
	if (!g_hypervisorType || g_hypervisorType.length == 0) 		
		g_hypervisorType = "kvm";
	
	if (!g_directAttachNetworkGroupsEnabled || g_directAttachNetworkGroupsEnabled.length == 0) 		
		g_directAttachNetworkGroupsEnabled = "false";	
		
	if (!g_directAttachedUntaggedEnabled || g_directAttachedUntaggedEnabled.length == 0) 		
		g_directAttachedUntaggedEnabled = "false";		
	
	if (!g_systemVmUseLocalStorage || g_systemVmUseLocalStorage.length == 0) 		
		g_systemVmUseLocalStorage = "false";
		
	$.ajax({
	    data: createURL("command=listZones&available=true&response=json"),
		dataType: "json",
		async: false,
		success: function(json) {
			// session is valid, continue
			if (isUser()) {
				$("#menutab_role_user #menutab_dashboard_user").click();
			} else if (isAdmin()) {
				$("#menutab_role_root #menutab_dashboard_root").click();
			} else if (isDomainAdmin()) {
				$("#menutab_role_domain #menutab_dashboard_domain").click();
			} else {
				logout(false);
			}
		},
		error: function(xmlHTTP) {
			logout(false);
		},
		beforeSend: function(xmlHTTP) {
			return true;
		}
	});
});


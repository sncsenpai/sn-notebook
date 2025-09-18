# General Platform Guidelines

## Description

This document is a set of guidelines and best practices we should adhere to when building on the Now Platform. It is broadly grouped into front-end and back-end sections, and the audience is intended to be ServiceNow implementers.

## General Development

The most important thing to do is to work as a team. In your project you will discuss various subjects such as code standards, Update Sets or other ServiceNow object naming conventions, and other subjects which can be decided in various ways. The most important factor is to have a standard, and to keep it. Keeping the same code standards across your teams makes Technical Peer Reviews much easier and means people can scan code quicker.

## Code Styles

Again, deciding a format between your group is the most important thing. A great place to be, if you are unsure, is to use someone like [Doug Crockford’s JavaScript standards](https://www.crockford.com/code.html)[^1].

This is universally accepted as a great example of a set of guidelines. Make sure, when onboarding new developers that the code standards you employ are shown to them, and re-enforced. Developers are usually happy to have a standard which guides them to introduce code.

## Client

### Blocking transactions

Transactions which the user is to submit, but which either take time or require user input must not block the browser. You must not use the ‘alert’ or ‘confirm’ features built-in to browsers, ServiceNow has a complex front-end application which requires that background activity must not be delayed.

### Reloading Pages

Your client-side scripts should *never* reload a page. This often employed as a tactic to refresh data on a page but is a terrible solution both for your users and for the platform.

Instead, you must selectively update the page if at all possible, and if not then you should use ServiceNow’s redirect methods, so that whole page refreshes do not happen.

### Confirmation dialogues/Input Modals

When you are requesting input from the user, you should make use of ServiceNow’s [Dialog](https://www.servicenow.com/docs/bundle/zurich-integrate-applications/page/product/rpa-studio/concept/dialogs.html) functionality, and UI pages to display the form where you request user input. You must not use the 'alert' or 'confirm' features built-in to browsers.

Example dialogue:

![A screenshot of an input modal](data:image/png;base64,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)

Code:

```javascript
var dialog = new GlideModal('glide_modal_confirm'); 
dialog.setTitle('Title'); 
dialog.setWidth('400'); 
dialog.setPreference('focusTrap', true); 
dialog.setPreference('body', 'Body text'); 
dialog.setPreference('buttonLabelComplete', 'Do it');  
dialog.setPreference('buttonLabelCancel', 'No, stop!'); 
dialog.setPreference('onPromptComplete', doComplete); 
dialog.setPreference('onPromptCancel', doCancel); 
dialog.render(); 

function doComplete() { 
  // Okay code comes here 
} 

function doCancel() { 
  // Cancel code comes here if needed 
} 
```

### Avoid Global UI Scripts

While it is useful and a good practice to create re-usable functions and store them inside of a UI Script, there is a temptation to make the script global. This *must* be avoided as the script will execute against every user transaction, thus resulting in performance issues.

Instead leverage the ScriptLoader API, details on its usage are available in the [ServiceNow Documentation](https://docs.servicenow.com/csh?topicname=c_ScriptLoaderAPI.html&version=).

#### ScriptLoader Example

##### UI Script

```javascript
var SampleScriptThing = Class.create(); 
SampleScriptThing.prototype = { 
    initialize: function (g_form) { 
        this.g_form = g_form; 
    }, 

    doSomething: function(field, value) { 
        console.log("New value: " + value + " on " + g_form.getDisplayValue()); 
    } 
}; 
```

##### Client Script

```javascript
ScriptLoader.getScripts(["SampleScriptThing.jsdbx?d="+new Date()], function() { 
    var uiScript = new SampleScriptThing(g_form); 
    uiScript.doSomething('state', newValue); 
}); 
```

However, do consider if your implementation can utilise `g_scratchpad` to reduce server lookups on the form. Refer to [Client-side script design and processing](https://docs.servicenow.com/bundle/washingtondc-api-reference/page/script/client-scripts/concept/client-script-best-practices.html#d853799e164) for more information.

## Server

### Script Includes

Script Includes should be considered 'library' type functionality, and in nearly all circumstances you should attempt to move any functionality you use into a Script Include.

Types:

- Store one classless function:
  - Stores one re-usable function
  - Used server-side only
- Define a new Class:
  - Collection of functions.
  - Can, potentially, be called by client-side scripts
  - Standard to include “Utils” in the name
- Extend an existing Class:
  - Add functionality to an existing Class
  - Can, potentially, be called by client-side scripts

### Client-Callable Script Includes

There is a convention in the industry to use a version of the Script Include to be client-callable, and a version for server side. This convention should be avoided. If a set of functions is to be considered client callable, the whole of the script include should simply be made available to the client.

You should protect every method with a role check or more complex definition if required. The Script Include should be protected with a role Access Control Rule as well, as is the default requirement in newer ServiceNow installations.

[^1]: Thanks to Alex Wells for providing this tip.

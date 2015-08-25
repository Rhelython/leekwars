// ==UserScript==
// @name            Leek Wars V2 - Editor Custom Documentation
// @namespace       https://github.com/Rhelython/leekwars
// @version         0.2.3
// @description     Help you to visualize your own documention in your code
// @author          Original author AluCardDH - Forked by Rhelython 
// @projectPage     https://github.com/Rhelython/leekwars
// @downloadURL     https://github.com/Rhelython/leekwars/raw/master/leekwars_v2_custom_documentation.user.js
// @updateURL       https://github.com/Rhelython/leekwars/raw/master/leekwars_v2_custom_documentation.user.js
// @match           http://leekwars.com
// @match           http://leekwars.com/*
// @include         http://leekwars.com
// @include         http://leekwars.com/*
// @require         http://leekwars.com/static/lib/jquery-2.1.1.min.js
// @grant           GM_addStyle
// @grant           unsafeWindow
// ==/UserScript==
 
var LEEKWARS_STRORAGE_BASE = "leekwars.";
var LEEKWARS_STRORAGE_DOC = LEEKWARS_STRORAGE_BASE+"documentation.";
var LEEKWARS_STRORAGE_AUTOLOAD = LEEKWARS_STRORAGE_BASE+"autoload";
 
var LEEKWARS_DOC_START = "/**";
var LEEKWARS_DOC_END = "*/";
 
var LEEKWARS_KEYWORD_VAR = "var";
var LEEKWARS_KEYWORD_GLOBAL = "global";
var LEEKWARS_KEYWORD_FUNCTION = "function";
 
var LEEKWARS_FONCTION_CLASS = "cm-function";
var LEEKWARS_FONCTION_LS_CLASS = "cm-lsfunc";
var LEEKWARS_COMMENT_CLASS = "cm-comment";
var LEEKWARS_VARIABLE_CLASS = "cm-variable";
var LEEKWARS_DECLARATION_CLASS = "-declaration";
 
/* --- TAGS --- */
 
var LEEKWARS_DOC_PARAM = "@param";
var LEEKWARS_DOC_RETURN = "@return";
var LEEKWARS_DOC_LEVEL = "@level";
var LEEKWARS_DOC_OPS = "@ops";
var LEEKWARS_DOC_AUTHOR = "@author";
var LEEKWARS_DOC_DATE = "@date"; // améliorer la visibilité et l'emplacement
var LEEKWARS_DOC_VERSION = "@version"; // améliorer la visibilité et l'emplacement
var LEEKWARS_DOC_REQUIRE = "@require"; // améliorer l'emplacement
var LEEKWARS_DOC_REFERENCE = "@reference"; // à faire - sous le titre
var LEEKWARS_DOC_URL = "@url"; // améliorer l'utilisation, notamment le lien générer au final est leekwars.com/www.google.fr
var LEEKWARS_DOC_PRE = "@pre"; // à faire - dans param
var LEEKWARS_DOC_POST = "@post"; // à faire - dans return
var LEEKWARS_DOC_EXCEPTION = "@exception";
 
/* --- STYLE --- */ 
// Paramètres
var LEEKWARS_COLOR_PARAMS  = ['#FE642E','#04B404','#2E9AFE','#FE2EC8','#FE9A2E','#642EFE','#2EFEF7']; // orange-rouge, vert lime, bleu ciel, rose, orange, violet, cyan
var LEEKWARS_COLOR_VERSION = "#642EFE"; // violet
var LEEKWARS_COLOR_AUTHOR  = "#642EFE"; // violet
var LEEKWARS_COLOR_DATE    = "#642EFE"; // violet
var LEEKWARS_COLOR_REQUIRE = ""; // a faire
 
 
 
 
var LEEKWARS_VALUE_REGEX = /.*=(.*);/i;
 
var US_AIS = [];
 
 
// Formattage _________________________________________________________________________
 
function docToCompletionName(doc) {
    var result = doc.name;
    if(doc.type==LEEKWARS_KEYWORD_FUNCTION) {
        result += "(";
        for(var paramIndex=0;paramIndex<doc.params.length;paramIndex++) {
            if(paramIndex>0) {
                result += ", ";
            }
            result += doc.params[paramIndex].name;
        }
        result += ")";
        if(doc.result) {
            result += " : "+doc.result.name;
        }
    }
    return result;
}
 
function docToString(doc){
        
// Titre
    var result = "<h4>";
    if(doc.type==LEEKWARS_KEYWORD_FUNCTION) {
        result += "Fonction <b>"+doc.name+"</b>(";
        for(var paramIndex=0;paramIndex<doc.params.length;paramIndex++) {
            if(paramIndex>0) {
                result += ", ";
            }
            var colorIndex = paramIndex % LEEKWARS_COLOR_PARAMS.length; // Selectionne la couleur du paramètre en bouclant si nb paramètres > nb color dispo
            result += "<span style='color:"+LEEKWARS_COLOR_PARAMS[colorIndex]+"'>"+ doc.params[paramIndex].name + "</span>";
        }
        result += ")";
        if(doc.result) {
            result += " : "+doc.result.name;
        }
    } else if(doc.type==LEEKWARS_KEYWORD_VAR) {
        result += "Variable locale <b>"+doc.name+"</b>";
    } else if(doc.type==LEEKWARS_KEYWORD_GLOBAL) {
        result += "Variable globale <b>"+doc.name+"</b>";
    }
    result += "</h4>";
  
// Version
    if(doc.version) {
        result += "Version <b><span style='color:"+LEEKWARS_COLOR_VERSION+"'>"+doc.version+"</span></b>    "; 
        result += (doc.author || doc.date)?"":"<br/>";
    }    
    
// Author et Date (même ligne que Version)
   if(doc.author && doc.date){ //author AND date
       result += "(Par <b><span style='color:"+LEEKWARS_COLOR_AUTHOR+"'>"+doc.author+"</span></b> - le <b><span style='color:"+LEEKWARS_COLOR_DATE+"'>"+doc.date+"</span></b>)<br/>"; 
       
   } else { // author XOR date
       if(doc.author) {
           result += "Par <b><span style='color:"+LEEKWARS_COLOR_AUTHOR+"'>"+doc.author+"</span></b><br/>";  
       }
       if(doc.date) {
           result += "Le <b><span style='color:"+LEEKWARS_COLOR_DATE+"'>"+doc.date+"</span></b><br/>";  
       }
   }
 
    
// Require
   if(doc.require) {
        result += "Fichier requis <b>"+doc.require+"</b><br/>";  
    } 
    
// Reference    
    
 
    
// pre
    
// post
 
// Niveau
    if(doc.level) {
        result += "Niveau <b>"+doc.level+"</b><br/>";
    }
    
// Opérations
    if(doc.ops) {
        var intValue = parseInt(doc.ops);
        if(!isNaN(intValue) && intValue+""==doc.ops) {
            result += "<b>"+intValue+"</b> opérations<br/>";
        } else {
            result += "Opérations <b>"+doc.ops+"</b><br/>";
        }
        
    }
    
// Description
    if(doc.description) {
        result += doc.description+"<br/>";
    }
    
// Valeur initiale
    if(doc.value) {
        result += "<br/><b>Valeur initiale</b><ul><li>"+doc.value+"</li></ul>";
    }
 
// Paramètres
    if(doc.params.length>0) {
        result += "<br/><b>Param&egrave;tres</b><ul>";
        for(var paramIndex=0;paramIndex<doc.params.length;paramIndex++) {
            var param = doc.params[paramIndex];
            /** // On supprime les espaces et * qui pourraient exister en début de chaîne
            var regex_captureParam = /(\s*)(\**)(.*)/;
            var paramCaptured = regex_captureParam.exec(param);
            console.log('paramètre capturé : ' + paramCaptured[2];**/
            var colorIndex = paramIndex % LEEKWARS_COLOR_PARAMS.length; // Selectionne la couleur du paramètre en bouclant si nb paramètres > nb color dispo
            result += "<li><span style='color:"+LEEKWARS_COLOR_PARAMS[colorIndex]+"'><b>"+param.name+"</b></span>";
	    
	    if( param.type ){
	    	result += " <i>("+ param.type +")</i>";
	    }
	    
	    if(param.description) {
                //result += "<span style='color:"+LEEKWARS_COLOR_PARAMS[colorIndex]+"'>";  // Colore la description du param de la même couleur
                result += (param.description.length > 36) ? " : <br/>"+param.description : " : "+param.description; // Commence la description à la ligne si elle ne peut pas tenir sur une ligne (description dépasse 36 caractères)
                //result += "</span>"; // Colore la description du param de la même couleur
            }
            result += "</li>";
        }
        result += "</ul>";
    }
    
// Résultat
    if(doc.result) {
        result += "<br/><b>Retour</b><ul>";
        result += "<li><span style='color:blue'><b>"+doc.result.name+"</b></span>";
        if(doc.result.type) {
            result += " <i>("+doc.result.type+")</i>"  
        }
 
 
        if(doc.result.description) {
            result += " : "+doc.result.description;
        }
        result += "</li></ul>";
        
    }
    
// Exceptions
    if(doc.exceptions.length>0) {
        result += "<br/><b>Exceptions</b><ul>";
        for(var exceptionIndex=0;exceptionIndex<doc.exceptions.length;exceptionIndex++) {
            var exception = doc.exceptions[exceptionIndex];
            result += "<li><span style='color:red'><b>"+exception.name+"</b></span>";
            if(exception.description) {
                result += " : "+exception.description;
            }
            result += "</li>";
        }
        result += "</ul>";
    }
 
// URL
   if(doc.url) {
        result += "<br/>URL <i><a href="+doc.url+">"+doc.url+"</a></i>";  
    }
    
// Source
    result += "<br/>D&eacute;fini dans l'IA <b>"+doc.ai+"</b> ligne "+doc.line;
    
    return result;
}
 
// Parsing
 
function getGlobalDeclarationName(line) {
    var matches = line.match(/^global (\w+)/);
    return matches==null ? null : matches[1];
}
 
function getVarDeclarationName(line) {
    var matches = line.match(/^var (\w+)/);
    return matches==null ? null : matches[1];
}
 
function getFunctionDeclarationName(line) {
 
    var matches = line.match(/^function (\w+)/);
    if(matches==null) {
        matches = line.match(/^var (\w+) ?= ?function\W/);
    }
    return matches==null ? null : matches[1];
}
 
function getFunctionDeclarationParams(line) {
    var open = line.indexOf("(");
    if(open>-1) {
        line = line.substring(open+1);
    }
    var close = line.indexOf(")");
    if(close>-1) {
        line = line.substring(0,close);
    }
    var results = line.split(",");
    var finalResult = [];
    for(var i=0;i<results.length;i++) {
        results[i] = results[i].trim();
        if(results[i]=="") {
            continue;
        }
        if(results[i].indexOf("@")==0) {
            results[i] = results[i].substring(1);
        }
        finalResult.push({name:results[i]});
    }
    return finalResult;
}
 
function hasOpeningAccolade(line) {
    return line.indexOf("{")>-1;
}
 
 
function updateAI(aiId) {
    var previousVersion = US_AIS[aiId];
    unsafeWindow.LW_API.getAI(aiId,function(newVersion){
        newVersion = newVersion.ai;
   //   console.log("new version : " + newVersion);
        newVersion.docs = {};
        
        if(previousVersion==null || previousVersion.code!=newVersion.code) {
            // Updating !
            //console.log("Updating "+newVersion.name);
            
            var lines = newVersion.code.split("\n");
            
            var currentDoc = null;
            var endOfDocLine = null;
            var endOfDeclaration = null;
            
            // Parsing new version
            
            $.each(lines,function(lineNumber,line) {
            
                var displayedLineNumber = lineNumber+1;
                var text = line.trim().replace(/\s+/g," ");
                if(text.indexOf(LEEKWARS_DOC_END)==-1) {
                    text = text.replace(/^\*+\s*/,"");
                }
                
 
                var functionName = getFunctionDeclarationName(text);
                var globalName = getGlobalDeclarationName(text);
                var varName = getVarDeclarationName(text);
 
 
                
 
                if(text==LEEKWARS_DOC_START) {
                    
                    currentDoc = {};
                    currentDoc.params = [];
                    currentDoc.exceptions = [];
                    currentDoc.ai = newVersion.name;
                    currentDoc.aiId = newVersion.id;
                    
                } else if(text==LEEKWARS_DOC_END) {
                    endOfDocLine = lineNumber;          
                    
                } else if(functionName!=null) {
                //  console.log(functionName);
                    // Décalaration d'une fonction
                    if(!currentDoc || endOfDocLine!=lineNumber-1) {
                        currentDoc = {};
                        currentDoc.params = getFunctionDeclarationParams(line);
                        currentDoc.exceptions = [];
                        currentDoc.ai = newVersion.name;
                        currentDoc.aiId = newVersion.id;
                    } else if(currentDoc.params.length===0) {
                        currentDoc.params = getFunctionDeclarationParams(line);
                        currentDoc.exception = [];
                    }
                    
                    currentDoc.type = LEEKWARS_KEYWORD_FUNCTION;
                    currentDoc.name = functionName;
                    currentDoc.line = displayedLineNumber;
                    
                    newVersion.docs[currentDoc.name] = currentDoc;
                //  console.log(currentDoc);
                    currentDoc = null;
                
                } else if(globalName!=null) {
                    // Décalaration d'une variable globale
                    if(!currentDoc || endOfDocLine!=lineNumber-1) {
                        currentDoc = {};
                        currentDoc.params = [];
                        currentDoc.exceptions = [];
                        currentDoc.ai = newVersion.name;
                        currentDoc.aiId = newVersion.id;
                    }
                    
                    currentDoc.type = LEEKWARS_KEYWORD_GLOBAL;
                    var testValue = LEEKWARS_VALUE_REGEX.exec(text);
                    if(testValue && testValue[1]) {
                        currentDoc.value = testValue[1].trim();
                    }
                    
                    currentDoc.name = globalName;
                    currentDoc.line = displayedLineNumber;
                    
                    newVersion.docs[currentDoc.name] = currentDoc;
                //  console.log(currentDoc);
                    currentDoc = null;
                
                }/* else if(varName!=null) {
                    // Décalaration d'une variable
                    if(!currentDoc || endOfDocLine!=lineNumber-1) {
                        currentDoc = {};
                        currentDoc.params = [];
                        currentDoc.ai = newVersion.name;
                        currentDoc.aiId = newVersion.id;
                    }
                    
                    currentDoc.type = LEEKWARS_KEYWORD_VAR;
                    
                    currentDoc.name = varName;
                    currentDoc.line = displayedLineNumber;
                    
                    newVersion.docs[currentDoc.name] = currentDoc;
                    currentDoc = null;
                
                }*/ else if(currentDoc) {
                    
                    var opsIndex = text.indexOf(LEEKWARS_DOC_OPS);
                    var levelIndex = text.indexOf(LEEKWARS_DOC_LEVEL);
                    var paramIndex = text.indexOf(LEEKWARS_DOC_PARAM);
                    var returnIndex = text.indexOf(LEEKWARS_DOC_RETURN);
                    var authorIndex = text.indexOf(LEEKWARS_DOC_AUTHOR);
                    var dateIndex = text.indexOf(LEEKWARS_DOC_DATE);
                    var versionIndex = text.indexOf(LEEKWARS_DOC_VERSION);
                    var requireIndex = text.indexOf(LEEKWARS_DOC_REQUIRE);
                    var referenceIndex = text.indexOf(LEEKWARS_DOC_REFERENCE);
                    var urlIndex = text.indexOf(LEEKWARS_DOC_URL);
                    var preIndex = text.indexOf(LEEKWARS_DOC_PRE);
                    var postIndex = text.indexOf(LEEKWARS_DOC_POST);
                    var exceptionIndex = text.indexOf(LEEKWARS_DOC_EXCEPTION);
                    
                    // Opération
 
                    if(opsIndex>-1) {
                        currentDoc.ops = text.substring(opsIndex+LEEKWARS_DOC_OPS.length).trim();
                    
                    // Niveau
 
                    } else if(levelIndex>-1) {
                        currentDoc.level = text.substring(levelIndex+LEEKWARS_DOC_LEVEL.length).trim();
                    
                    // Autheur
                    } else if(authorIndex>-1){
                        currentDoc.author = text.substring(authorIndex+LEEKWARS_DOC_AUTHOR.length).trim();
                        
                    // Date
                    } else if(dateIndex>-1){
                        currentDoc.date = text.substring(dateIndex+LEEKWARS_DOC_DATE.length).trim();
                    
                    // Version
                    } else if(versionIndex>-1){
                        currentDoc.version = text.substring(versionIndex+LEEKWARS_DOC_VERSION.length).trim();
                        
                    // IA requis
                    } else if(requireIndex>-1){
                        currentDoc.require = text.substring(requireIndex+LEEKWARS_DOC_REQUIRE.length).trim();
                        
                    // Reference
                    } else if(referenceIndex>-1){
                        currentDoc.reference = text.substring(referenceIndex+LEEKWARS_DOC_REFERENCE.length).trim();
                        
                    // URL
                    } else if(urlIndex>-1){
                        currentDoc.url = text.substring(urlIndex+LEEKWARS_DOC_URL.length).trim();
                        
                    // Preconditions
                    } else if(preIndex>-1){
                        currentDoc.pre = text.substring(preIndex+LEEKWARS_DOC_PRE.length).trim();
                        
                    // PostConditions
                    } else if(postIndex>-1){
                        currentDoc.post = text.substring(postIndex+LEEKWARS_DOC_POST.length).trim();
                        
                    // Exceptions
                    } else if(exceptionIndex>-1) {
                        var subText = text.substring(exceptionIndex+LEEKWARS_DOC_EXCEPTION.length).trim();
                        var exceptionNameEndIndex = subText.indexOf(" ");
                        var exception = {};
                        if(exceptionNameEndIndex>-1) {
                            exception.name = subText.substring(0,exceptionNameEndIndex);
                            exception.description = subText.substring(exceptionNameEndIndex).trim();
                        } else {
                            exception.name = subText;
                        }
                        currentDoc.exceptions.push(exception);
                        
                    // Paramètres
 
                    } else if(paramIndex>-1) {
                        var subText = text.substring(paramIndex+LEEKWARS_DOC_PARAM.length).trim();
 
 
 
 
 
 
                        var paramNameEndIndex = subText.indexOf(" ");
                        var param = {};
                        if(subText.indexOf("(")==0) {
                            var typeEndIndex = subText.indexOf(")");
                            param.type = subText.substring(1,typeEndIndex);
                            subText = subText.substring(typeEndIndex+1).trim();
                        }
                        var paramNameEndIndex = subText.indexOf(" ");
 
                        if(paramNameEndIndex>-1) {
                            param.name = subText.substring(0,paramNameEndIndex);
                            param.description = subText.substring(paramNameEndIndex).trim();
                        } else {
                            param.name = subText;
                        }
                        currentDoc.params.push(param);
                        
                    // Return
 
                    } else if(returnIndex>-1) {
                        var subText = text.substring(returnIndex+LEEKWARS_DOC_RETURN.length).trim();
                        var param = {};
                        if(subText.indexOf("(")==0) {
                            var typeEndIndex = subText.indexOf(")");
                            param.type = subText.substring(1,typeEndIndex);
                            subText = subText.substring(typeEndIndex+1).trim();
                        }
                        var paramNameEndIndex = subText.indexOf(" ");
                        var param = {};
                        if(paramNameEndIndex>-1) {
                            param.name = subText.substring(0,paramNameEndIndex);
                            param.description = subText.substring(paramNameEndIndex).trim();
                        } else {
                            param.name = subText;
                        }
                        currentDoc.result = param;
                        
                    // Description - Cas général
 
                    } else {
                        if(!currentDoc.description) {
                            currentDoc.description = "";
                        }
                        currentDoc.description += "<br/>"+text.trim();
                    }
                    
                    
                }           
            
            });
            
            // Checking previous version
            if(previousVersion!=null) {
                $.each(previousVersion.docs,function(name,doc) {
                    
                    var newDoc = newVersion.docs[doc.name];
                    if(newDoc!=null) {
                        newDoc.index = doc.index;
                        unsafeWindow.LW.keywords[doc.index] = cloneInto([newDoc.name,docToCompletionName(newDoc),docToString(newDoc),newDoc.type,newDoc.params.length],unsafeWindow);
                    } else {
                        //unsafeWindow.LW.keywords[doc.index] = null;
                    }
                    
                });
            }
            
            // applying new doc
            $.each(newVersion.docs,function(name,newDoc) {
                if(newDoc.index==null) {
                    //unsafeWindow.LW.keywords.push(d);
                    newDoc.index = unsafeWindow.LW.keywords.push(cloneInto([newDoc.name,docToCompletionName(newDoc),docToString(newDoc),newDoc.type,newDoc.params.length],unsafeWindow))-1;//unsafeWindow.LW.keywords.length;
                    //newDoc.index = unsafeWindow.LW.keywords.length+1;
                    //unsafeWindow.LW.keywords[newDoc.index] = d;
                    //unsafeWindow.LW.keywords.push(d);//unsafeWindow.LW.keywords.length;
                }               
            });
            
            US_AIS[aiId] = newVersion;
            
        }
    });
}
 
function update() {
    if(unsafeWindow.LW.keywords!=null) {
        
        unsafeWindow.LW_API.getAIs(function(ias){
            $.each(ias,function(index,ai){
                updateAI(ai.id);
            });
        });
    }
    
    
}
 
setInterval(update,5000);
 
 
function getEditor() {
    return unsafeWindow.editors!=null && unsafeWindow.current!=null ? unsafeWindow.editors[unsafeWindow.current] : null;
}
 
function leekwarsUpdateHintDetails() {
    var editor = getEditor();
    
    if(editor!=null) {
        var dialog = editor.hintDialog;
        
        if(dialog.css("display")=="block") {    
        //  console.log("hintDialog visible !");
            var alreadyPresentHints = {};
            
            var completions = editor.completions;
        //console.log(completions);
            // doc présente
            for(var index=completions.length-1;index>=0;index--) {
            //  console.log(alreadyPresentHints);
            //  console.log(completion);
                var completion = completions[index];
                if(completion.type!="keyword") {
                    alreadyPresentHints[completion.text] = true;
                } else if(alreadyPresentHints[completion.text]) {
                //  console.log("to remove !");
                    //var element = dialog.find(".hint:nth-child("+(index+1)+")");
                    //if(element.text()==completion.name) {
                        completions.splice(index,1);
                        dialog.find(".hint:nth-child("+(index+1)+")").remove();
                        dialog.find(".detail:nth-child("+(index+1)+")").remove();
                    //}
                }
            }
        }
    }
    
    
}
 
setInterval(leekwarsUpdateHintDetails,100);
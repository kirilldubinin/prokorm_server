!function(){"use strict";angular.module("prokorm",["ngResource","ui.router","ngMaterial","ngMdIcons","nvd3"]),angular.module("prokorm").constant("_",window._),angular.module("prokorm").config(["$mdDateLocaleProvider",function($mdDateLocaleProvider){$mdDateLocaleProvider.formatDate=function(date){return moment(date).format("DD-MM-YYYY")}}]),angular.module("prokorm").config(["$httpProvider",function($httpProvider){function isAPIrequest(url){return/^\/?api\//.test(url)}function convertDateStringsToDates(input){if("object"!=typeof input)return input;for(var key in input)if(input.hasOwnProperty(key)){var match,value=input[key];if("string"==typeof value&&(match=value.match(regexIso8601))){var milliseconds=Date.parse(match[0]);isNaN(milliseconds)||(input[key]=new Date(milliseconds))}else"object"==typeof value&&convertDateStringsToDates(value)}}$httpProvider.defaults.headers.get||($httpProvider.defaults.headers.get={}),$httpProvider.defaults.headers.get["If-Modified-Since"]="Mon, 26 Jul 1997 05:00:00 GMT",$httpProvider.defaults.headers.get["Cache-Control"]="no-cache",$httpProvider.defaults.headers.get.Pragma="no-cache",$httpProvider.interceptors.push(function($q,$injector){return{request:function(config){return config},requestError:function(rejection){return $q.reject(rejection)},response:function(response){return isAPIrequest(response.config.url)?response.data:response},responseError:function(rejection){return console.log(rejection.data.message||rejection.data.name),401===rejection.status&&$injector.get("$state").transitionTo("farm.login"),isAPIrequest(rejection.config.url)?(401!==rejection.status&&rejection.data.message&&alert(rejection.data.message),$q.reject(rejection.data)):$q.reject(rejection)}}});var regexIso8601=/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;$httpProvider.defaults.transformResponse.push(function(responseData){return convertDateStringsToDates(responseData),responseData})}])}(),function(){"use strict";function runBlock($rootScope){$rootScope._=window._}angular.module("prokorm").run(runBlock)}(),function(){"use strict";function routerConfig($stateProvider,$urlRouterProvider){$stateProvider.state("farm",{url:"/farm",abstract:!0,templateUrl:"app/rootTemplate.html"}).state("farm.registration",{url:"/registration",templateUrl:"app/login/registration.html",controller:"RegistrationController",controllerAs:"registration"}).state("farm.login",{url:"/login",templateUrl:"app/login/login.html",controller:"LoginController",controllerAs:"login"}).state("farm.login.tenant",{url:"/:tenant",templateUrl:"app/login/login.html",controller:"LoginController",controllerAs:"login",params:{tenant:void 0}}).state("farm.instance",{url:"/:id",templateUrl:"app/home/home.html",controller:"HomeController",controllerAs:"home",abstract:!0,params:{id:void 0}}).state("farm.instance.settings",{url:"/settings",templateUrl:"app/settings/settings.html",controller:"SettingsController",controllerAs:"settings"}).state("farm.instance.profile",{url:"/profile",templateUrl:"app/profile/profile.html",abstract:!0}).state("farm.instance.profile.view",{url:"/view",templateUrl:"app/profile/profileView.html",controller:"ProfileViewController",controllerAs:"profileView"}).state("farm.instance.profile.addUser",{url:"/addUser",templateUrl:"app/profile/addUser.html",controller:"AddUserController",controllerAs:"addUser"}).state("farm.instance.profile.edit",{url:"/edit",templateUrl:"app/profile/profileEdit.html",controller:"ProfileEditController",controllerAs:"profileEdit"}).state("farm.instance.ration",{url:"/ration",templateUrl:"app/ration/ration.html",controller:"RationController",controllerAs:"ration",data:{module:"ration"}}).state("farm.instance.ration.instance",{url:"/:rationId",templateUrl:"app/ration/rationView/rationView.html",controller:"RationViewController",controllerAs:"rationView",params:{rationId:void 0},data:{module:"catalog"}}).state("farm.instance.catalog",{url:"/catalog",templateUrl:"app/catalog/catalog.html",controller:"CatalogController",controllerAs:"catalog",data:{module:"catalog"}}).state("farm.instance.catalog.edit",{url:"/:terms/edit",templateUrl:"app/catalog/catalogContentEdit.html",controller:"CatalogContentEditController",controllerAs:"catalogContentEdit",params:{terms:void 0},data:{module:"catalog"}}).state("farm.instance.catalog.instance",{url:"/:terms",templateUrl:"app/catalog/catalogContent.html",controller:"CatalogContentController",controllerAs:"catalogContent",params:{terms:void 0},data:{module:"catalog"}}).state("farm.instance.feed",{url:"/feed",templateUrl:"app/feed/feedList/feed.html",controller:"FeedController",controllerAs:"feed",data:{module:"feed"}}).state("farm.instance.feed.charts",{url:"/charts",templateUrl:"app/feed/charts/charts.html",controller:"ChartsController",controllerAs:"charts",params:{params:void 0},data:{module:"feed"}}).state("farm.instance.feed.diff",{url:"/diff/:feeds",templateUrl:"app/feed/diff/diff.html",controller:"DiffController",controllerAs:"diff",params:{feeds:void 0},data:{module:"feed"}}).state("farm.instance.feed.sum",{url:"/sum/:feeds",templateUrl:"app/feed/sum/sum.html",controller:"SumController",controllerAs:"sum",params:{feeds:void 0},data:{module:"feed"}}).state("farm.instance.feed.average",{url:"/average/:feeds",templateUrl:"app/feed/average/average.html",controller:"AverageController",controllerAs:"average",params:{feeds:void 0},data:{module:"feed"}}).state("farm.instance.feed.new",{url:"/new",templateUrl:"app/feed/feedEdit/feedEdit.html",controller:"FeedEditController",controllerAs:"feedEdit",data:{module:"feed"}}).state("farm.instance.feed.edit",{url:"/:feedId/edit",templateUrl:"app/feed/feedEdit/feedEdit.html",controller:"FeedEditController",controllerAs:"feedEdit",params:{feedId:void 0},data:{module:"feed"}}).state("farm.instance.feed.instance",{url:"/:feedId",templateUrl:"app/feed/feedView/feedView.html",controller:"FeedViewController",controllerAs:"feedView",params:{feedId:void 0},data:{module:"feed"}}),$urlRouterProvider.otherwise("/")}angular.module("prokorm").config(routerConfig)}(),function(){"use strict";function CatalogController($state,catalogFactory){var vm=this;vm.currentKey=$state.params.terms,catalogFactory.getCatalog().then(function(items){vm.catalogItems=items}),vm.onItemClick=function(catalogItem){vm.currentKey=catalogItem.key,$state.go("farm.instance.catalog.instance",{terms:catalogItem.key})}}angular.module("prokorm").controller("CatalogController",CatalogController)}(),function(){"use strict";function CatalogContentController($state,catalogFactory){var vm=this;vm.edit=function(){$state.go("farm.instance.catalog.edit",{terms:$state.params.terms})},$state.params.terms&&catalogFactory.getCatalogContentByKey($state.params.terms).then(function(catalogItem){vm.catalogItem=catalogItem})}angular.module("prokorm").controller("CatalogContentController",CatalogContentController)}(),function(){"use strict";function CatalogContentEditController($state,catalogFactory){var vm=this;vm.save=function(){catalogFactory.saveCatalogContentByKey(vm.catalogItem).then(function(catalogItem){$state.go("farm.instance.catalog.instance",{terms:$state.params.terms})})},$state.params.terms&&catalogFactory.getCatalogContentByKey($state.params.terms).then(function(catalogItem){vm.catalogItem=catalogItem})}angular.module("prokorm").controller("CatalogContentEditController",CatalogContentEditController)}(),angular.module("prokorm").factory("catalogFactory",["$http","$location",function($http,$location){var host="",urlBase=host+"/api/",catalogFactory={};return catalogFactory.getCatalog=function(){return $http.get(urlBase+"catalog")},catalogFactory.getCatalogContentByKey=function(key){return $http.get(urlBase+"catalog/"+key)},catalogFactory.saveCatalogContentByKey=function(catalog){return $http.put(urlBase+"catalog/"+catalog.key,catalog)},catalogFactory}]),angular.module("prokorm").factory("feedFactory",["$http","$location",function($http,$location){var host="",urlBase=host+"/api/",urlBaseFeed=urlBase+"feeds/",feedFactory={};return feedFactory.getFeeds=function(){return $http.get(urlBaseFeed)},feedFactory.getFeedDashboard=function(){return $http.get(urlBaseFeed+"dashboard")},feedFactory.saveFeed=function(feed){var methode=feed._id?"put":"post",url=feed._id?urlBaseFeed+feed._id:urlBaseFeed;return $http[methode](url,feed)},feedFactory.getFeedView=function(feedId){return $http.get(urlBaseFeed+feedId+"/view")},feedFactory.getFeedEdit=function(feedId){return $http.get(urlBaseFeed+feedId+"/edit")},feedFactory.getEmptyFeed=function(){return $http.post(urlBaseFeed+"new")},feedFactory.getEmptyAnalysis=function(){return $http.post(urlBaseFeed+"newAnalysis")},feedFactory.deleteFeed=function(feedId){return $http.delete(urlBaseFeed+feedId)},feedFactory.diffFeeds=function(feedIds){return $http.post(urlBaseFeed+"diff",{feedIds:feedIds})},feedFactory.sumFeeds=function(feedIds){return $http.post(urlBaseFeed+"sum",{feedIds:feedIds})},feedFactory.averageFeeds=function(feedIds){return $http.post(urlBaseFeed+"average",{feedIds:feedIds})},feedFactory.getCharts=function(){return $http.get(urlBaseFeed+"charts")},feedFactory}]),angular.module("prokorm").factory("loginFactory",["$http","$location",function($http,$location){var host="",urlBase=host+"/api/",loginFactory={};return loginFactory.logout=function(){return $http.post(urlBase+"logout/")},loginFactory.login=function(user){return $http.post(urlBase+"signin/",user)},loginFactory.registration=function(user){return $http.post(urlBase+"registration/",user)},loginFactory.getSessionData=function(){return $http.get(urlBase+"sessionData/")},loginFactory.getProfileView=function(){return $http.get(urlBase+"profile/view")},loginFactory.getProfileEdit=function(){return $http.get(urlBase+"profile/edit")},loginFactory.updateProfile=function(profile){return $http.put(urlBase+"profile",profile)},loginFactory.addUser=function(user){return $http.post(urlBase+"users",user)},loginFactory.setPassword=function(pass){return $http.post(urlBase+"profile/password",pass)},loginFactory}]),function(){"use strict";function AverageController($scope,feedFactory,$stateParams,_){function updateAverageRows(feedsForAverage){return feedsForAverage.length?void feedFactory.averageFeeds(feedsForAverage).then(function(result){vm.dryRawValues=result.dryRawValues,vm.headers=result.headers,vm.analysisRows=result.analysis,vm.averageRows=result.average}):(vm.averageRows=[],void(vm.headers=[]))}var vm=this;vm.propertiesForDiff=[],vm._=_;$stateParams.feeds;$scope.$on("$stateChangeSuccess",function(event,newState,params,oldState){"farm.instance.feed.average"===newState.name&&updateAverageRows(params.feeds.split(":"))})}angular.module("prokorm").controller("AverageController",AverageController)}(),function(){"use strict";function ChartsController($scope,feedFactory,$stateParams,_){var vm=this;feedFactory.getCharts().then(function(data){vm.data=[{values:data,key:"Сырая зола",color:"#ff7f0e"}],vm.options={chart:{type:"lineChart",height:450,margin:{top:20,right:20,bottom:40,left:55},x:function(d){return d.x},y:function(d){return d.y},useInteractiveGuideline:!0,dispatch:{stateChange:function(e){console.log("stateChange")},changeState:function(e){console.log("changeState")},tooltipShow:function(e){console.log("tooltipShow")},tooltipHide:function(e){console.log("tooltipHide")}},xAxis:{axisLabel:"Год"},yAxis:{}},title:{enable:!1,text:"График"}}})}angular.module("prokorm").controller("ChartsController",ChartsController)}(),function(){function groupButtons(){var directive={restrict:"E",templateUrl:"app/feed/controls/groupButtons/groupButtons.html",scope:{items:"=",allowAdd:"=",onAdd:"&",onDelete:"&",onSelect:"&"},replace:!0,controller:GroupButtonsController,controllerAs:"groupButtons",bindToController:!0};return directive}function GroupButtonsController($scope){var self=this;$scope.items=self.items,$scope.$watchCollection("items.length",function(){console.log(self.items.length),self.selected=_.last(self.items),self.onSelect({item:self.selected})},!0),self.onClick=function(item){console.log(self.items.length),self.selected=item,self.onSelect({item:self.selected})}}angular.module("prokorm").directive("groupButtons",groupButtons)}(),function(){"use strict";function DiffController($scope,feedFactory,$stateParams,_){function updateDiffRows(feedsForDiff){return feedsForDiff.length?void feedFactory.diffFeeds(feedsForDiff).then(function(result){vm.dryRawValues=result.dryRawValues,vm.headers=result.headers,vm.diffRows=result.diffs}):(vm.diffRows=[],void(vm.headers=[]))}var vm=this;vm._=_;$stateParams.feeds;$scope.$on("$stateChangeSuccess",function(event,newState,params,oldState){"farm.instance.feed.diff"===newState.name&&updateDiffRows(params.feeds.split(":"))})}angular.module("prokorm").controller("DiffController",DiffController)}(),function(){"use strict";function FeedEdiController($window,$stateParams,$state,$scope,feedFactory){var vm=this;vm.feedItem={analysis:[]},vm.feedTypes=[{value:"none",name:"Нет"},{value:"haylage",name:"Сенаж"},{value:"silage",name:"Силос"},{value:"grain",name:"Зерно"},{value:"cornSilage",name:"Силосованное зерно"},{value:"straw",name:"Солома"},{value:"hay",name:"Сено"},{value:"oilcake",name:"Жмых"},{value:"meal",name:"Шрот"},{value:"greenWeight",name:"Зеленая масса"},{value:"tmr",name:"TMR"}],vm.feedItemControls=[];var feedId=$stateParams.feedId,promise=feedId?feedFactory.getFeedEdit(feedId):feedFactory.getEmptyFeed();promise.then(function(feed){vm.feedItemSections=feed,vm.feedItem.analysis=_.map(feed[0].subSections,function(subSection){return subSection.initialItem})}),vm.deleteCurrentAnalysis=function(){vm.feedItemSections[0].subSections=_.filter(vm.feedItemSections[0].subSections,function(sebSection){return sebSection.initialItem!==vm.currentAnalysis}),vm.feedItem.analysis=_.map(vm.feedItemSections[0].subSections,function(subSection){return subSection.initialItem})},vm.onAnalysisAdd=function(){feedFactory.getEmptyAnalysis().then(function(newAnalysis){if(vm.feedItem.analysis&&vm.feedItem.analysis.length){var max=_.maxBy(vm.feedItem.analysis,"number");newAnalysis.initialItem.number=max.number+1,vm.feedItem.analysis.push(newAnalysis)}vm.feedItemSections[0].subSections.push(newAnalysis),vm.feedItem.analysis=_.map(vm.feedItemSections[0].subSections,function(subSection){return subSection.initialItem})})},vm.onAnalysisSelect=function(item){vm.currentAnalysis=item},vm.save=function(){var feed={analysis:_.map(vm.feedItemSections[0].subSections,function(subSection){return subSection.initialItem}),general:vm.feedItemSections[1].subSections[0].initialItem,harvest:vm.feedItemSections[2].subSections[0].initialItem,feeding:vm.feedItemSections[3].subSections[0].initialItem};feedId&&(feed._id=feedId),feedFactory.saveFeed(feed).then(function(response){"OK"===response.message&&$state.go("farm.instance.feed.instance",{feedId:response.id})})},vm.cancel=function(){feedId?$state.go("farm.instance.feed.instance",{feedId:feedId}):$state.go("farm.instance.feed")},vm.onSelfExplanationLinkClick=function(key){$state.go("farm.help",{key:key})}}angular.module("prokorm").controller("FeedEditController",FeedEdiController)}(),function(){"use strict";function FeedController($scope,$window,$state,feedFactory,$mdDialog){var vm=this;vm.filter={noAnalysis:!0,showEmpty:!0};var originatorEv;feedFactory.getFeeds().then(function(result){vm.filterValues=result.filterValues,vm.feedItems=result.feeds,vm.selectedItemId=$state.params.feedId}),feedFactory.getFeedDashboard().then(function(dashboard){vm.dashboard=dashboard}),vm.openMenu=function($mdOpenMenu,ev){originatorEv=ev,$mdOpenMenu(ev)},vm.goToHome=function(){vm.selectedItemId=null,$state.go("farm.instance.feed")},vm.addFeed=function(){vm.selectedItemId=null,$state.go("farm.instance.feed.new")},vm.diffFeed=function(){vm.selectedItemId=null,$state.go("farm.instance.feed.diff")},vm.averageFeed=function(){vm.selectedItemId=null,$state.go("farm.instance.feed.average")},vm.sumFeed=function(){vm.selectedItemId=null,$state.go("farm.instance.feed.sum")},vm.isVisible=function(feedItem){if(feedItem.isVisible=!1,vm.filter){if(!vm.filter.showEmpty)return!feedItem.done;if(!vm.filter.noAnalysis)return feedItem.analysis;if(vm.filter.years&&vm.filter.years.length&&!_.includes(vm.filter.years,feedItem.year))return!1;if(vm.filter.feedTypes&&vm.filter.feedTypes.length&&!_.includes(vm.filter.feedTypes,feedItem.feedType))return!1;if(vm.filter.compositions&&vm.filter.compositions.length&&!_.includes(vm.filter.compositions,feedItem.composition))return!1;if(vm.filter.storages&&vm.filter.storages.length&&!_.includes(vm.filter.storages,feedItem.storage))return!1}return!(vm.isDiffMode&&!feedItem.analysis)&&(!(vm.isAverageMode&&!feedItem.analysis)&&(!!(!vm.isSumMode||feedItem.analysis&&feedItem.balanceWeight)&&(feedItem.isVisible=!0)))},vm.toggleFilter=function(){vm.filter.visible=!vm.filter.visible,vm.hiddenItemsLength=_.size(_.filter(vm.feedItems,{isVisible:!1}))},vm.onFeedClick=function(feedItem){if(vm.isDiffMode||vm.isAverageMode||vm.isSumMode){var currentFeeds=_.filter($state.params.feeds.split(":"),function(o){return o}),ind=currentFeeds.indexOf(feedItem._id);ind>-1?currentFeeds.splice(ind,1):currentFeeds.push(feedItem._id),$state.go(vm.lastState,{feeds:currentFeeds.join(":")})}else vm.selectedItemId=feedItem._id,$state.go("farm.instance.feed.instance",{feedId:feedItem._id})},$scope.$on("stateChangeStart",function(oldState,newState){}),$scope.$on("$stateChangeSuccess",function(event,newState,params,oldState){vm.lastState=newState.name,vm.isDiffMode="farm.instance.feed.diff"===newState.name,vm.isAverageMode="farm.instance.feed.average"===newState.name,vm.isSumMode="farm.instance.feed.sum"===newState.name,vm.diffFeeds=null,vm.averageFeeds=null,vm.sumFeeds=null,vm.isDiffMode?(vm.selectedItemId=null,vm.diffFeeds=params.feeds.split(":")):vm.isAverageMode?(vm.selectedItemId=null,vm.averageFeeds=params.feeds.split(":")):vm.isSumMode?(vm.selectedItemId=null,vm.sumFeeds=params.feeds.split(":")):"farm.instance.feed"===newState.name?(vm.selectedItemId=null,feedFactory.getFeedDashboard().then(function(dashboard){vm.dashboard=dashboard})):"farm.instance.feed.instance"===newState.name&&(vm.selectedItemId=params.feedId,console.log(params),console.log(params.feedId)),"farm.instance.feed.edit"!==oldState.name&&"farm.instance.feed.new"!==oldState.name||feedFactory.getFeeds().then(function(result){vm.feedItems=result.feeds,vm.filterValues=result.filterValues})})}angular.module("prokorm").controller("FeedController",FeedController)}(),function(){"use strict";function feedFilter(){var directive={restrict:"E",templateUrl:"app/feed/feedFilter.html",scope:{card:"="},controller:FeedFilterController,controllerAs:"feedFilter",bindToController:!0};return directive}function FeedFilterController(){}angular.module("prokorm").directive("feedFilter",feedFilter)}(),function(){"use strict";function FeedViewController($mdDialog,$stateParams,$state,feedFactory,_){var vm=this;vm._=_;var feedId=$stateParams.feedId;feedId&&(vm.isDrySwitch=!0,vm.diff=function(){$state.go("farm.instance.feed.diff",{feeds:[feedId].join(":")})},vm.edit=function(){$state.go("farm.instance.feed.edit",{feedId:feedId})},vm.delete=function(ev){var confirm=$mdDialog.confirm().title("removeFeedConfirmDialogTitle").textContent("removeFeedConfirmDialogContent").targetEvent(ev).ok("yes").cancel("no");$mdDialog.show(confirm).then(function(){feedFactory.deleteFeed($stateParams.feedId).then(function(res){$state.go("farm.instance.feed")})},function(){})},feedFactory.getFeedView(feedId).then(function(feedView){vm.feed=feedView.general,vm.feedItemSections=feedView.feedItemSections,vm.actions=feedView.actions}))}FeedViewController.$inject=["$mdDialog","$stateParams","$state","feedFactory","_"],angular.module("prokorm").controller("FeedViewController",FeedViewController)}(),function(){"use strict";function SumController($scope,feedFactory,$stateParams,_){function updateSum(feedsForDiff){return feedsForDiff.length?void feedFactory.sumFeeds(feedsForDiff).then(function(result){vm.properties=result.properties,vm.sumsRows=result.sumsRows}):(vm.diffRows=[],void(vm.headers=[]))}var vm=this;vm._=_;$stateParams.feeds;$scope.$on("$stateChangeSuccess",function(event,newState,params,oldState){"farm.instance.feed.sum"===newState.name&&updateSum(params.feeds.split(":"))})}angular.module("prokorm").controller("SumController",SumController)}(),function(){"use strict";function HomeController($scope,$state,loginFactory,$mdDialog){var originatorEv,vm=this;vm.currentModule="",loginFactory.getSessionData().then(function(data){vm.sessionData=data}),vm.openMenu=function($mdOpenMenu,ev){originatorEv=ev,$mdOpenMenu(ev)},vm.goToModule=function(module){$state.go("farm.instance."+module)},vm.logout=function(){loginFactory.logout()},vm.profile=function(){$state.go("farm.instance.profile.view")},$scope.$on("$stateChangeSuccess",function(event,newState,params,oldState){vm.currentModule=newState.data&&newState.data.module})}angular.module("prokorm").controller("HomeController",HomeController)}(),function(){"use strict";function LoginController($http,$state,loginFactory){var vm=this;vm.tenantName=$state.params.tenant,vm.user={tenantname:vm.tenantName||"",username:"",password:""},vm.do=function(){loginFactory.login(vm.user).then(function(response){$state.go("farm.instance.feed",{id:response.tenantName})},function(err){vm.info=err.message})},vm.goToRegistration=function(){}}angular.module("prokorm").controller("LoginController",LoginController)}(),function(){"use strict";function RegistrationController($http,loginFactory){var vm=this;vm.user={loginname:"",email:""},vm.do=function(){vm.error="",loginFactory.registration(vm.user).then(function(response){response&&response.message&&(vm.successMessage=response.message)},function(err){vm.error=err.message})},vm.goToRegistration=function(){}}angular.module("prokorm").controller("RegistrationController",RegistrationController)}(),function(){"use strict";function ProfileViewController($scope,$state,$mdDialog,loginFactory){var vm=this;loginFactory.getProfileView().then(function(result){vm.userInfo=result.controls,vm.companyUsers=result.companyUsers}),vm.edit=function(){$state.go("farm.instance.profile.edit")},vm.changePassword=function(ev){$mdDialog.show({controller:ChangePasswordController,templateUrl:"./app/profile/changePassword.html",parent:angular.element(document.body),targetEvent:ev,clickOutsideToClose:!1}).then(function(answer){$state.go("farm.instance.profile.view")},function(){$state.go("farm.instance.profile.view")})},vm.addUser=function(){$state.go("farm.instance.profile.addUser")}}function ProfileEditController($scope,$state,loginFactory){var vm=this;loginFactory.getProfileEdit().then(function(result){vm.userInfo=result.controls,vm.profile=result.profile}),vm.save=function(){loginFactory.updateProfile(vm.profile).then(function(result){"OK"===result.message&&$state.go("farm.instance.profile.view")})},vm.cancel=function(){$state.go("farm.instance.profile.view")}}function AddUserController($scope,$state,loginFactory){var vm=this;vm.user={name:"",fullName:"",email:"",password:"",tenantFullName:""},vm.cancel=function(){$state.go("farm.instance.profile.view")},vm.save2=function(){if(vm.user.password===vm.password_2){var permissions=[];vm.allowRead&&permissions.push("read"),vm.allowWrite&&permissions.push("write");var user=_.extend(vm.user,{permissions:permissions});loginFactory.addUser(user).then(function(result){"OK"===result.message&&$state.go("farm.instance.profile.view")})}}}function ChangePasswordController($scope,$mdDialog,loginFactory){$scope.currentPassword="",$scope.newPassword="",$scope.newPassword2="",$scope.cancel=function(){$mdDialog.cancel()},$scope.save=function(){loginFactory.setPassword({currentPassword:$scope.currentPassword,newPassword:$scope.newPassword,newPassword2:$scope.newPassword2}).then(function(data){"OK"===data.message&&$state.go("farm.instance.profile.view")})}}angular.module("prokorm").controller("ProfileViewController",ProfileViewController),angular.module("prokorm").controller("ProfileEditController",ProfileEditController),angular.module("prokorm").controller("AddUserController",AddUserController),angular.module("prokorm").controller("ChangePasswordController",ChangePasswordController)}(),function(){"use strict";function SettingsController($scope,$state){}angular.module("prokorm").controller("SettingsController",SettingsController)}();
var UIScreen = require('UIKit/UIScreen'),
    UIColor = require('UIKit/UIColor'),
    NSURLRequest = require('Foundation/NSURLRequest'),
    NSURL = require('Foundation/NSURL'),
    WKWebView = require("WebKit/WKWebView"),
    WKNavigation = require("WebKit/WKNavigation");



function WKWebView(args){
	
	this.wkurl = args.url;
	
	return this.createWindow();
	
}

WKWebView.prototype.createWindow = function createWindow(){
	
	this.win = Ti.UI.createWindow();
	this.win.add(this.createWebView());
	this.win.open();
	
};

WKWebView.prototype.createWebView = function createWebView() {
    
    var WebViewDelegate = this.createWebViewDelegate();
    var delegate = new WebViewDelegate();
    
    delegate.didStartProvisionalNavigation = function(webView, navigation) {
        var loader = Ti.UI.createActivityIndicator();
        $.window.setRightNavButton(loader);
        loader.show();
    };
    
    delegate.didFinishNavigation = function(webView, navigation) {
        $.window.setRightNavButton(null);
    };
    
    this.web = WKWebView.alloc().initWithFrame(UIScreen.mainScreen().bounds);
    this.web.setBackgroundColor(UIColor.clearColor());
    this.web.setOpaque(false);
    this.web.setNavigationDelegate(delegate);
    this.web.loadRequest(NSURLRequest.alloc().initWithURL(NSURL.alloc().initWithString(this.wkurl)));
    
    return this.web;
    
};

WKWebView.prototype.createWebViewDelegate = function createWebViewDelegate() {
    var WebViewDelegate = Hyperloop.defineClass('WebViewDelegate', 'NSObject', ['WKNavigationDelegate']);

    WebViewDelegate.addMethod({
        selector: 'webView:didStartProvisionalNavigation:',
        instance: true,
        arguments: ['WKWebView', 'WKNavigation'],
        callback: function (webView, navigation) {
            if (this.didStartProvisionalNavigation) {
                this.didStartProvisionalNavigation(webView, navigation);
            }
        }
    });
    
    WebViewDelegate.addMethod({
        selector: 'webView:didFinishNavigation:',
        instance: true,
        arguments: ['WKWebView', 'WKNavigation'],
        callback: function (webView, navigation) {
            if (this.didFinishNavigation) {
                this.didFinishNavigation(webView, navigation);
            }
        }
    });    
    
    return WebViewDelegate;
    
};

exports = new WKWebView();

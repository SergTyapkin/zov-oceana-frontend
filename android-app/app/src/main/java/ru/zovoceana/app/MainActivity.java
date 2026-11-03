package ru.zovoceana.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

/** Remote website shell. No JavaScript/native bridge is exposed to web content. */
public class MainActivity extends Activity {
    private static final int PICK_FILE = 10;
    private WebView web;
    private ProgressBar progress;
    private LinearLayout error;
    private String site;
    private Uri siteUri;
    private ValueCallback<Uri[]> fileCallback;
    private Dialog popup;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        site = getString(R.string.site_url);
        siteUri = Uri.parse(site);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(24, 24, 24));
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            // Android 15 enforces edge-to-edge: keep the website out of system bars.
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                        insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        web = new WebView(this);
        configure(web);
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        root.addView(progress, new FrameLayout.LayoutParams(-1, 6, Gravity.TOP));
        error = new LinearLayout(this);
        error.setOrientation(LinearLayout.VERTICAL);
        error.setGravity(Gravity.CENTER);
        error.setPadding(32, 32, 32, 32);
        error.setBackgroundColor(Color.rgb(24, 24, 24));
        TextView message = new TextView(this);
        message.setText(R.string.load_error);
        message.setTextColor(Color.WHITE);
        message.setGravity(Gravity.CENTER);
        error.addView(message);
        Button retry = new Button(this);
        retry.setText(R.string.retry);
        retry.setOnClickListener(view -> { error.setVisibility(View.GONE); web.reload(); });
        error.addView(retry);
        root.addView(error, new FrameLayout.LayoutParams(-1, -1));
        error.setVisibility(View.GONE);
        setContentView(root);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) {
                    String scheme = request.getUrl().getScheme();
                    if (request.hasGesture() && !"https".equals(scheme) && !"http".equals(scheme)) {
                        openExternal(request.getUrl());
                        return true;
                    }
                    return false;
                }
                if (isSite(request.getUrl())) return false;
                openExternal(request.getUrl());
                return true;
            }
            @Override public void onPageStarted(WebView view, String url, android.graphics.Bitmap icon) {
                error.setVisibility(View.GONE);
            }
            @Override public void onPageFinished(WebView view, String url) { CookieManager.getInstance().flush(); }
            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError failure) {
                if (request.isForMainFrame()) showError();
            }
            @Override public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
                if (request.isForMainFrame() && response.getStatusCode() >= 400) showError();
            }
            // SSL failures use Android's default cancellation. Never proceed past them.
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView view, int value) {
                progress.setProgress(value);
                progress.setVisibility(value < 100 ? View.VISIBLE : View.GONE);
            }
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/*");
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                try { startActivityForResult(intent, PICK_FILE); }
                catch (ActivityNotFoundException exception) { fileCallback.onReceiveValue(null); fileCallback = null; }
                return true;
            }
            @Override public boolean onCreateWindow(WebView view, boolean dialog, boolean userGesture, Message result) {
                if (!userGesture) return false;
                WebView child = new WebView(MainActivity.this);
                configure(child);
                Dialog window = new Dialog(MainActivity.this);
                if (popup != null) popup.dismiss();
                popup = window;
                window.setContentView(child);
                window.setOnDismissListener(ignored -> { child.destroy(); if (popup == window) popup = null; });
                child.setWebViewClient(new WebViewClient() {
                    @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                        Uri uri = request.getUrl();
                        String host = uri.getHost();
                        // Telegram's login popup must keep window.opener and cookies.
                        if (isSite(uri) || ("https".equals(uri.getScheme()) && "oauth.telegram.org".equals(host))) return false;
                        openExternal(uri);
                        window.dismiss();
                        return true;
                    }
                });
                child.setWebChromeClient(new WebChromeClient() {
                    @Override public void onCloseWindow(WebView view) { window.dismiss(); }
                });
                window.show();
                window.getWindow().setLayout(-1, -1);
                ((WebView.WebViewTransport) result.obj).setWebView(child);
                result.sendToTarget();
                return true;
            }
        });
        Uri initial = getIntent().getData();
        if (initial != null && isSite(initial)) web.loadUrl(initial.toString());
        else if (state == null || web.restoreState(state) == null) web.loadUrl(site);
    }

    @SuppressLint("SetJavaScriptEnabled") private void configure(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(view, true);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        view.setBackgroundColor(Color.rgb(24, 24, 24));
    }

    private boolean isSite(Uri uri) {
        return "https".equals(uri.getScheme()) && siteUri.getHost().equalsIgnoreCase(uri.getHost())
                && (uri.getPort() == -1 || uri.getPort() == 443) && uri.getUserInfo() == null;
    }

    private void showError() { error.setVisibility(View.VISIBLE); progress.setVisibility(View.GONE); }

    private void openExternal(Uri uri) {
        String scheme = uri.getScheme();
        if (scheme == null || "javascript".equals(scheme) || "file".equals(scheme)
                || "content".equals(scheme) || "data".equals(scheme) || "about".equals(scheme)) return;
        Uri target = uri;
        String fallback = null;
        String packageName = null;
        if ("intent".equals(scheme)) {
            try {
                Intent parsed = Intent.parseUri(uri.toString(), Intent.URI_INTENT_SCHEME);
                target = parsed.getData();
                fallback = parsed.getStringExtra("browser_fallback_url");
                packageName = parsed.getPackage();
                if (target == null || !isExternalScheme(target.getScheme())) return;
            } catch (java.net.URISyntaxException exception) { return; }
        } else if (!isExternalScheme(scheme)) return;
        Intent intent = new Intent(Intent.ACTION_VIEW, target).addCategory(Intent.CATEGORY_BROWSABLE);
        // Do not forward arbitrary components, selectors, or extras from web content.
        if (packageName != null) intent.setPackage(packageName);
        try { startActivity(intent); }
        catch (ActivityNotFoundException exception) {
            if (fallback != null && "https".equals(Uri.parse(fallback).getScheme())) {
                try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fallback))); return; }
                catch (ActivityNotFoundException ignored) { }
            }
            Toast.makeText(this, R.string.no_application, Toast.LENGTH_LONG).show();
        }
    }

    private boolean isExternalScheme(String scheme) {
        return scheme != null && (scheme.equals("https") || scheme.equals("http") || scheme.equals("tel")
                || scheme.equals("mailto") || scheme.equals("tg") || scheme.equals("sbp")
                || scheme.equals("sberpay") || scheme.equals("tinkoffbank") || scheme.matches("bank[0-9]+"));
    }

    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Uri uri = intent.getData();
        if (uri != null && isSite(uri)) web.loadUrl(uri.toString());
    }
    @Override public void onBackPressed() {
        if (popup != null) popup.dismiss();
        else if (error.getVisibility() == View.VISIBLE) { error.setVisibility(View.GONE); web.loadUrl(site); }
        else if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
    @Override protected void onSaveInstanceState(Bundle state) { web.saveState(state); super.onSaveInstanceState(state); }
    @Override protected void onPause() { CookieManager.getInstance().flush(); web.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == PICK_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCallback = null;
        }
    }
    @Override protected void onDestroy() {
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        if (popup != null) popup.dismiss();
        if (web != null) web.destroy();
        super.onDestroy();
    }
}

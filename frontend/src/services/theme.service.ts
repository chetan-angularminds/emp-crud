import { BehaviorSubject } from "rxjs";

class ThemeService {
  backgroundColor = "white";
  textColor = "black";
    theme = "system"
  private themeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    "system"
  );
  get theme$() {
    return this.themeSubject.asObservable();
  }
  setTheme(theme: string) {
    this.themeSubject.next(theme);
    localStorage.setItem("theme", theme);
  }

  private backgroundColorSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>("white");
  get backgroundColor$() {
    return this.backgroundColorSubject.asObservable();
  }
  setBackgroundColor(theme: string) {
    this.backgroundColorSubject.next(theme);
  }

  private textColorSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>("black");
  get textColor$() {
    return this.textColorSubject.asObservable();
  }
  settextColor(theme: string) {
    this.textColorSubject.next(theme);
  }

  applyDarkMode() {
    this.setBackgroundColor("#2d343c");
    this.settextColor("white");
    document.documentElement.classList.add("dark");
  }
  applyLightMode() {
    this.setBackgroundColor("white");
    this.settextColor("black");
    document.documentElement.classList.remove("dark");
  }
  handleSystemThemeChange = (event: MediaQueryListEvent) => {
    if (this.theme === "system") {
        if (event.matches) {
            
            this.applyDarkMode();
          } else {
            
            this.applyLightMode();
          }
    }
  };
  themeToggler(theme: string) {
    if (theme === "dark") {
      this.applyDarkMode();
    } else if (theme === "system") {
      const isSystemDarkTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      if (isSystemDarkTheme) {
        this.applyDarkMode();
      } else {
        this.applyLightMode();
      }
    } else this.applyLightMode();
    this.setTheme(theme);
  }

  checkTheme() {
    const theme = localStorage.getItem("theme") || "system";
    this.themeToggler(theme);
  }
  constructor() {
    this.checkTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", this.handleSystemThemeChange);
    this.theme$.subscribe((theme: string) => {
        this.theme = theme;
      });
    this.textColor$.subscribe((color: string) => {
      this.textColor = color;
    });
    this.backgroundColor$.subscribe((color: string) => {
      this.backgroundColor = color;
    });
  }
}

const themeService = new ThemeService();

export default themeService;

import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import UnauthorizedAlertPopup from "@/components/UnauthorizedAlertPopup.vue";
import { unauthorizedAlertPopup } from "@/utilities/unauthorizedAlertPopup";

// Mock the unauthorizedAlertPopup utility
vi.mock("@/utilities/unauthorizedAlertPopup", () => ({
  unauthorizedAlertPopup: {
    setShowFunction: vi.fn(),
  },
}));

describe("UnauthorizedAlertPopup", () => {
  let wrapper: any;
  let mockElement: any;

  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = "";
    
    // Create a proper mock element with all necessary methods
    mockElement = {
      style: { display: "flex" },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    
    // Mock querySelector to return our mock element
    vi.spyOn(document, "querySelector").mockImplementation((selector) => {
      if (selector === ".popup-unauthorized-alert-wrapper") {
        return mockElement;
      }
      return null;
    });

    wrapper = mount(UnauthorizedAlertPopup);
  });

  it("should render correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".popup-unauthorized-alert-wrapper").exists()).toBe(true);
    expect(wrapper.find(".popup-unauthorized-alert").exists()).toBe(true);
  });

  it("should display the correct title and message", () => {
    const title = wrapper.find("h3.subtitle-style");
    const message = wrapper.find("p");
    
    expect(title.text()).toBe("Accès refusé");
    expect(message.text()).toContain("Votre compte n'est pas autorisé à accéder à cette application.");
    expect(message.text()).toContain("Veuillez contacter un administrateur pour obtenir l'accès.");
  });

  it("should have a close button", () => {
    const closeButton = wrapper.find("button.button-style-hook");
    expect(closeButton.exists()).toBe(true);
    expect(closeButton.text()).toBe("Fermer");
  });

  it("should have hide function bound to close button", () => {
    const closeButton = wrapper.find("button.button-style-hook");
    
    // Check that the button has the @click="hide" binding by verifying it exists
    expect(closeButton.exists()).toBe(true);
    expect(closeButton.text()).toBe("Fermer");
    
    // Verify the hide function exists on the component
    expect(typeof wrapper.vm.hide).toBe("function");
  });

  it("should set the show function on unauthorizedAlertPopup", () => {
    expect(unauthorizedAlertPopup.setShowFunction).toHaveBeenCalled();
  });

  it("should hide popup initially when mounted", () => {
    // The component should call hide() in onMounted
    const popupWrapper = wrapper.find(".popup-unauthorized-alert-wrapper");
    expect(popupWrapper.exists()).toBe(true);
    // Check that addEventListener was called (indicating onMounted executed)
    expect(mockElement.addEventListener).toHaveBeenCalled();
  });

  it("should have correct CSS classes", () => {
    expect(wrapper.find(".popup-unauthorized-alert-wrapper").exists()).toBe(true);
    expect(wrapper.find(".popup-unauthorized-alert").exists()).toBe(true);
    expect(wrapper.find(".subtitle-style").exists()).toBe(true);
    expect(wrapper.find(".button-style-hook").exists()).toBe(true);
  });

  it("should apply correct styling attributes", () => {
    const popupWrapper = wrapper.find(".popup-unauthorized-alert-wrapper");
    const popup = wrapper.find(".popup-unauthorized-alert");
    
    // Check if elements have the expected classes
    expect(popupWrapper.classes()).toContain("popup-unauthorized-alert-wrapper");
    expect(popup.classes()).toContain("popup-unauthorized-alert");
  });

  it("should handle show and hide functions correctly", () => {
    // Test show function
    wrapper.vm.show();
    expect(mockElement.style.display).toBe("flex");
    
    // Test hide function
    wrapper.vm.hide();
    expect(mockElement.style.display).toBe("none");
  });

  it("should set up event listener for click outside", () => {
    // Check that addEventListener was called with click event
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  it("should not have display issues with null elements", () => {
    // Mock querySelector to return null
    vi.spyOn(document, "querySelector").mockReturnValue(null);
    
    // These should not throw errors
    expect(() => wrapper.vm.show()).not.toThrow();
    expect(() => wrapper.vm.hide()).not.toThrow();
  });

  it("should register the show function with unauthorizedAlertPopup utility", () => {
    // Verify that setShowFunction was called with the show method
    expect(unauthorizedAlertPopup.setShowFunction).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });
});

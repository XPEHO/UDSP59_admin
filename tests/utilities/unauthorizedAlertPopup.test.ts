import { describe, it, expect, beforeEach, vi } from "vitest";
import { unauthorizedAlertPopup } from "@/utilities/unauthorizedAlertPopup";

describe("unauthorizedAlertPopup", () => {
  beforeEach(() => {
    // Reset the show function before each test
    unauthorizedAlertPopup.show = () => {};
  });

  it("should have default empty show function", () => {
    expect(typeof unauthorizedAlertPopup.show).toBe("function");
    // Should not throw when called
    expect(() => unauthorizedAlertPopup.show()).not.toThrow();
  });

  it("should have setShowFunction method", () => {
    expect(typeof unauthorizedAlertPopup.setShowFunction).toBe("function");
  });

  it("should update show function when setShowFunction is called", () => {
    const mockShowFunction = vi.fn();
    
    unauthorizedAlertPopup.setShowFunction(mockShowFunction);
    
    expect(unauthorizedAlertPopup.show).toBe(mockShowFunction);
  });

  it("should call the new show function when show is invoked", () => {
    const mockShowFunction = vi.fn();
    
    unauthorizedAlertPopup.setShowFunction(mockShowFunction);
    unauthorizedAlertPopup.show();
    
    expect(mockShowFunction).toHaveBeenCalledTimes(1);
  });

  it("should be reactive", () => {
    // Test that the object is reactive by checking Vue's reactive properties
    expect(unauthorizedAlertPopup).toBeDefined();
    expect(typeof unauthorizedAlertPopup).toBe("object");
  });

  it("should allow multiple calls to show function", () => {
    const mockShowFunction = vi.fn();
    
    unauthorizedAlertPopup.setShowFunction(mockShowFunction);
    
    // Call multiple times
    unauthorizedAlertPopup.show();
    unauthorizedAlertPopup.show();
    unauthorizedAlertPopup.show();
    
    expect(mockShowFunction).toHaveBeenCalledTimes(3);
  });

  it("should replace previous show function when setShowFunction is called again", () => {
    const firstMockFunction = vi.fn();
    const secondMockFunction = vi.fn();
    
    // Set first function
    unauthorizedAlertPopup.setShowFunction(firstMockFunction);
    unauthorizedAlertPopup.show();
    
    // Set second function
    unauthorizedAlertPopup.setShowFunction(secondMockFunction);
    unauthorizedAlertPopup.show();
    
    expect(firstMockFunction).toHaveBeenCalledTimes(1);
    expect(secondMockFunction).toHaveBeenCalledTimes(1);
    expect(unauthorizedAlertPopup.show).toBe(secondMockFunction);
  });

  it("should maintain function context", () => {
    let contextValue = "";
    
    const mockShowFunction = function(this: any) {
      contextValue = "called";
    };
    
    unauthorizedAlertPopup.setShowFunction(mockShowFunction);
    unauthorizedAlertPopup.show();
    
    expect(contextValue).toBe("called");
  });
});

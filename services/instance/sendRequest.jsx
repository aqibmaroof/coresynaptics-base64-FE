import {
  getCollection,
  getById,
  createItem,
  updateItem,
  deleteItem,
  initializeDefaultData,
} from "./localStorageDB";

// Initialize default data on first load
if (typeof window !== "undefined") {
  initializeDefaultData();
}

/**
 * Parse URL to extract collection name and ID
 * Examples:
 *   /projects -> { collection: 'projects', id: null }
 *   /projects/123 -> { collection: 'projects', id: '123' }
 *   /projects/123/users -> { collection: 'projects', id: '123', subCollection: 'users' }
 */
const parseUrl = (url) => {
  // Remove leading slash and query params
  const cleanUrl = url.replace(/^\//, "").split("?")[0];
  const parts = cleanUrl.split("/").filter(Boolean);

  // Map URL paths to collection names
  const collectionMap = {
    projects: "projects",
    users: "users",
    tasks: "tasks",
    teams: "teams",
    roles: "roles",
    sites: "sites",
    leads: "leads",
    deals: "deals",
    contacts: "contacts",
    companies: "companies",
    equipment: "equipment",
    inventory: "inventory",
    documents: "documents",
    issues: "issues",
    rfis: "rfis",
    submittals: "submittals",
    changerequests: "changerequests",
    "change-requests": "changerequests",
    meetings: "meetings",
    activities: "activities",
    subscriptions: "subscriptions",
    permissions: "permissions",
    "org-sops": "orgsops",
    "org-workflows": "orgworkflows",
    "org-safety-plans": "orgsafetyplans",
    "org-toolbox-talks": "orgtoolboxtalks",
    "phase-gates": "phasegates",
    zones: "zones",
    checklists: "checklists",
    subtasks: "subtasks",
    communications: "communications",
    payroll: "payroll",
    tarf: "tarf",
    assets: "assets",
    billing: "billing",
    contracts: "contracts",
    procurement: "procurement",
    "vendor-quotes": "vendorquotes",
    "shipment-logistics": "shipmentlogistics",
    onboarding: "onboarding",
    "mob-catalog": "mobcatalog",
    "cx-projects": "cxprojects",
    types: "types",
    admin: "admin",
    setup: "setup",
  };

  const collection = collectionMap[parts[0]?.toLowerCase()] || parts[0]?.toLowerCase();
  const id = parts[1] || null;
  const subCollection = parts[2] ? collectionMap[parts[2]?.toLowerCase()] || parts[2]?.toLowerCase() : null;
  const subId = parts[3] || null;

  return { collection, id, subCollection, subId };
};

/**
 * Simulate API delay (optional, makes it feel more realistic)
 */
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 100));

/**
 * Handle special routes that don't fit the standard CRUD pattern
 */
const handleSpecialRoutes = (url, method, data) => {
  const cleanUrl = url.replace(/^\//, "").split("?")[0];
  
  // Setup routes
  if (cleanUrl.startsWith("setup")) {
    const setupData = getCollection("setup")[0] || {
      id: "setup-1",
      sessionId: "session-1",
      currentStep: 1,
      company: {},
      scope: {},
      facility: {},
      equipment: [],
      team: [],
      brand: {},
    };
    
    if (cleanUrl.includes("draft")) {
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("company")) {
      setupData.company = data;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("scope")) {
      setupData.scope = data;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("facility")) {
      setupData.facility = data;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("equipment-defaults")) {
      return { success: true, data: { defaults: getCollection("equipment") } };
    }
    if (cleanUrl.includes("equipment")) {
      setupData.equipment = data;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("role-presets")) {
      return { success: true, data: getCollection("roles") };
    }
    if (cleanUrl.includes("team")) {
      setupData.team = data;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("brand")) {
      setupData.brand = data;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("review")) {
      return { success: true, data: setupData };
    }
    if (cleanUrl.includes("finalize")) {
      setupData.finalized = true;
      updateItem("setup", "setup-1", setupData) || createItem("setup", setupData);
      return { success: true, message: "Setup completed", data: setupData };
    }
    return { success: true, data: setupData };
  }
  
  // Auth routes
  if (cleanUrl.startsWith("auth")) {
    return null; // Let auth.jsx handle these
  }
  
  // Organization routes
  if (cleanUrl.startsWith("organizations")) {
    return {
      success: true,
      data: {
        id: "org-1",
        name: "Development Organization",
        description: "Local development organization",
      },
    };
  }
  
  return null; // Not a special route
};

/**
 * LocalStorage-based request handler
 * Replaces axios calls with localStorage operations
 */
const sendRequest = async ({
  url,
  method = "GET",
  data,
  params,
  headers = {},
}) => {
  await simulateDelay();

  // Check for special routes first
  const specialResult = handleSpecialRoutes(url, method, data);
  if (specialResult) {
    return specialResult;
  }

  const { collection, id, subCollection, subId } = parseUrl(url);
  const upperMethod = method.toUpperCase();

  try {
    // Handle GET requests
    if (upperMethod === "GET") {
      if (id && !subCollection) {
        // Get single item by ID
        const item = getById(collection, id);
        if (!item) {
          return { success: true, data: null, message: "Item not found" };
        }
        return { success: true, data: item };
      } else if (id && subCollection) {
        // Get sub-collection (e.g., /projects/123/users)
        const parentItem = getById(collection, id);
        if (!parentItem) {
          return { success: true, data: [], message: "Parent not found" };
        }
        // Return associated items
        const subItems = getCollection(subCollection);
        return { success: true, data: subItems };
      } else {
        // Get all items in collection
        let items = getCollection(collection);
        
        // Apply basic filtering from query params
        if (params) {
          Object.keys(params).forEach((key) => {
            if (params[key]) {
              items = items.filter((item) => 
                item[key]?.toString().toLowerCase().includes(params[key].toString().toLowerCase())
              );
            }
          });
        }
        
        return {
          success: true,
          data: items,
          total: items.length,
          pagination: {
            total: items.length,
            page: 1,
            limit: 25,
            pages: Math.ceil(items.length / 25),
          },
        };
      }
    }

    // Handle POST requests (Create)
    if (upperMethod === "POST") {
      if (id && subCollection) {
        // Add to sub-collection (e.g., adding users to project)
        const newItem = createItem(subCollection, { ...data, [`${collection}Id`]: id });
        return { success: true, data: newItem, message: "Created successfully" };
      } else {
        const newItem = createItem(collection, data);
        return { success: true, data: newItem, message: "Created successfully" };
      }
    }

    // Handle PUT/PATCH requests (Update)
    if (upperMethod === "PUT" || upperMethod === "PATCH") {
      if (!id) {
        throw new Error("ID required for update");
      }
      const updatedItem = updateItem(collection, id, data);
      if (!updatedItem) {
        throw new Error("Item not found");
      }
      return { success: true, data: updatedItem, message: "Updated successfully" };
    }

    // Handle DELETE requests
    if (upperMethod === "DELETE") {
      if (!id) {
        throw new Error("ID required for delete");
      }
      if (subId) {
        // Delete from sub-collection
        deleteItem(subCollection, subId);
        return { success: true, message: "Deleted successfully" };
      }
      deleteItem(collection, id);
      return { success: true, message: "Deleted successfully" };
    }

    throw new Error(`Unsupported method: ${method}`);
  } catch (error) {
    console.error("[v0] LocalStorage request error:", error);
    throw { message: error.message || "Request failed", error };
  }
};

export default sendRequest;

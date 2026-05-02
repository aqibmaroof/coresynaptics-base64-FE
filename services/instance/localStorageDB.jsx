/**
 * LocalStorage-based database simulation
 * Replaces backend API calls with localStorage operations
 */

const DB_PREFIX = "app_db_";

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Get all items from a collection
export const getCollection = (collection) => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`${DB_PREFIX}${collection}`);
  return data ? JSON.parse(data) : [];
};

// Save collection to localStorage
export const saveCollection = (collection, data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${DB_PREFIX}${collection}`, JSON.stringify(data));
};

// Get single item by ID
export const getById = (collection, id) => {
  const items = getCollection(collection);
  return items.find((item) => item.id === id || item._id === id);
};

// Create new item
export const createItem = (collection, item) => {
  const items = getCollection(collection);
  const newItem = {
    ...item,
    id: item.id || generateId(),
    _id: item._id || generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveCollection(collection, items);
  return newItem;
};

// Update item by ID
export const updateItem = (collection, id, updates) => {
  const items = getCollection(collection);
  const index = items.findIndex((item) => item.id === id || item._id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveCollection(collection, items);
  return items[index];
};

// Delete item by ID
export const deleteItem = (collection, id) => {
  const items = getCollection(collection);
  const filtered = items.filter((item) => item.id !== id && item._id !== id);
  saveCollection(collection, filtered);
  return { success: true };
};

// Initialize default data if empty
export const initializeDefaultData = () => {
  if (typeof window === "undefined") return;

  // Initialize projects
  if (getCollection("projects").length === 0) {
    const defaultProjects = [
      {
        id: "proj-1",
        _id: "proj-1",
        name: "Solar Farm Installation",
        description: "Large-scale solar panel installation project",
        status: "active",
        priority: "high",
        startDate: "2024-01-15",
        endDate: "2024-06-30",
        progress: 45,
        budget: 2500000,
        location: "Phoenix, AZ",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj-2",
        _id: "proj-2",
        name: "Wind Turbine Maintenance",
        description: "Quarterly maintenance for wind farm",
        status: "in_progress",
        priority: "medium",
        startDate: "2024-02-01",
        endDate: "2024-03-15",
        progress: 72,
        budget: 150000,
        location: "Oklahoma City, OK",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj-3",
        _id: "proj-3",
        name: "Battery Storage Expansion",
        description: "Grid-scale battery storage installation",
        status: "planning",
        priority: "high",
        startDate: "2024-04-01",
        endDate: "2024-12-31",
        progress: 10,
        budget: 5000000,
        location: "Las Vegas, NV",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveCollection("projects", defaultProjects);
  }

  // Initialize users
  if (getCollection("users").length === 0) {
    const defaultUsers = [
      {
        id: "user-1",
        _id: "user-1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        role: "admin",
        status: "active",
        phone: "+1 555-0101",
        department: "Operations",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user-2",
        _id: "user-2",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        role: "manager",
        status: "active",
        phone: "+1 555-0102",
        department: "Engineering",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user-3",
        _id: "user-3",
        firstName: "Mike",
        lastName: "Williams",
        email: "mike.williams@example.com",
        role: "technician",
        status: "active",
        phone: "+1 555-0103",
        department: "Field Operations",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveCollection("users", defaultUsers);
  }

  // Initialize tasks
  if (getCollection("tasks").length === 0) {
    const defaultTasks = [
      {
        id: "task-1",
        _id: "task-1",
        title: "Site Survey",
        description: "Complete initial site survey for solar installation",
        status: "completed",
        priority: "high",
        projectId: "proj-1",
        assigneeId: "user-2",
        dueDate: "2024-01-20",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "task-2",
        _id: "task-2",
        title: "Equipment Procurement",
        description: "Order solar panels and mounting equipment",
        status: "in_progress",
        priority: "high",
        projectId: "proj-1",
        assigneeId: "user-1",
        dueDate: "2024-02-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "task-3",
        _id: "task-3",
        title: "Turbine Inspection",
        description: "Inspect turbine blades for wear",
        status: "pending",
        priority: "medium",
        projectId: "proj-2",
        assigneeId: "user-3",
        dueDate: "2024-02-10",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveCollection("tasks", defaultTasks);
  }

  // Initialize teams
  if (getCollection("teams").length === 0) {
    const defaultTeams = [
      {
        id: "team-1",
        _id: "team-1",
        name: "Alpha Team",
        description: "Primary installation crew",
        members: ["user-1", "user-2"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "team-2",
        _id: "team-2",
        name: "Beta Team",
        description: "Maintenance specialists",
        members: ["user-3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveCollection("teams", defaultTeams);
  }

  // Initialize roles
  if (getCollection("roles").length === 0) {
    const defaultRoles = [
      { id: "role-1", _id: "role-1", name: "Admin", permissions: ["all"], createdAt: new Date().toISOString() },
      { id: "role-2", _id: "role-2", name: "Manager", permissions: ["read", "write", "manage"], createdAt: new Date().toISOString() },
      { id: "role-3", _id: "role-3", name: "Technician", permissions: ["read", "write"], createdAt: new Date().toISOString() },
      { id: "role-4", _id: "role-4", name: "Viewer", permissions: ["read"], createdAt: new Date().toISOString() },
    ];
    saveCollection("roles", defaultRoles);
  }

  // Initialize sites
  if (getCollection("sites").length === 0) {
    const defaultSites = [
      {
        id: "site-1",
        _id: "site-1",
        name: "Phoenix Solar Site",
        address: "123 Desert Rd, Phoenix, AZ 85001",
        status: "active",
        type: "solar",
        createdAt: new Date().toISOString(),
      },
      {
        id: "site-2",
        _id: "site-2",
        name: "Oklahoma Wind Farm",
        address: "456 Wind Way, Oklahoma City, OK 73101",
        status: "active",
        type: "wind",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("sites", defaultSites);
  }

  // Initialize leads
  if (getCollection("leads").length === 0) {
    const defaultLeads = [
      {
        id: "lead-1",
        _id: "lead-1",
        name: "ABC Corporation",
        contact: "Jane Doe",
        email: "jane@abccorp.com",
        phone: "+1 555-1234",
        status: "new",
        value: 500000,
        source: "Referral",
        createdAt: new Date().toISOString(),
      },
      {
        id: "lead-2",
        _id: "lead-2",
        name: "XYZ Industries",
        contact: "Bob Wilson",
        email: "bob@xyzind.com",
        phone: "+1 555-5678",
        status: "qualified",
        value: 1200000,
        source: "Website",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("leads", defaultLeads);
  }

  // Initialize deals
  if (getCollection("deals").length === 0) {
    const defaultDeals = [
      {
        id: "deal-1",
        _id: "deal-1",
        name: "Solar Installation Contract",
        value: 2500000,
        stage: "proposal",
        probability: 60,
        expectedClose: "2024-03-15",
        leadId: "lead-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("deals", defaultDeals);
  }

  // Initialize contacts
  if (getCollection("contacts").length === 0) {
    const defaultContacts = [
      {
        id: "contact-1",
        _id: "contact-1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@abccorp.com",
        phone: "+1 555-1234",
        company: "ABC Corporation",
        createdAt: new Date().toISOString(),
      },
      {
        id: "contact-2",
        _id: "contact-2",
        firstName: "Bob",
        lastName: "Wilson",
        email: "bob@xyzind.com",
        phone: "+1 555-5678",
        company: "XYZ Industries",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("contacts", defaultContacts);
  }

  // Initialize companies
  if (getCollection("companies").length === 0) {
    const defaultCompanies = [
      {
        id: "company-1",
        _id: "company-1",
        name: "ABC Corporation",
        industry: "Manufacturing",
        website: "https://abccorp.com",
        address: "789 Industry Blvd, Chicago, IL 60601",
        createdAt: new Date().toISOString(),
      },
      {
        id: "company-2",
        _id: "company-2",
        name: "XYZ Industries",
        industry: "Technology",
        website: "https://xyzind.com",
        address: "321 Tech Park, San Jose, CA 95101",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("companies", defaultCompanies);
  }

  // Initialize equipment
  if (getCollection("equipment").length === 0) {
    const defaultEquipment = [
      {
        id: "equip-1",
        _id: "equip-1",
        name: "Crane #1",
        type: "Heavy Machinery",
        status: "available",
        location: "Phoenix, AZ",
        lastMaintenance: "2024-01-01",
        createdAt: new Date().toISOString(),
      },
      {
        id: "equip-2",
        _id: "equip-2",
        name: "Solar Panel Installer",
        type: "Installation Equipment",
        status: "in_use",
        location: "On-site",
        lastMaintenance: "2024-01-10",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("equipment", defaultEquipment);
  }

  // Initialize inventory
  if (getCollection("inventory").length === 0) {
    const defaultInventory = [
      {
        id: "inv-1",
        _id: "inv-1",
        name: "Solar Panel 400W",
        sku: "SP-400W",
        quantity: 500,
        unit: "pcs",
        location: "Warehouse A",
        createdAt: new Date().toISOString(),
      },
      {
        id: "inv-2",
        _id: "inv-2",
        name: "Mounting Brackets",
        sku: "MB-001",
        quantity: 1200,
        unit: "pcs",
        location: "Warehouse A",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("inventory", defaultInventory);
  }

  // Initialize documents
  if (getCollection("documents").length === 0) {
    const defaultDocuments = [
      {
        id: "doc-1",
        _id: "doc-1",
        name: "Project Proposal.pdf",
        type: "proposal",
        size: "2.5 MB",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "doc-2",
        _id: "doc-2",
        name: "Safety Guidelines.pdf",
        type: "safety",
        size: "1.2 MB",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("documents", defaultDocuments);
  }

  // Initialize issues
  if (getCollection("issues").length === 0) {
    const defaultIssues = [
      {
        id: "issue-1",
        _id: "issue-1",
        title: "Delayed shipment",
        description: "Solar panels shipment delayed by 2 weeks",
        status: "open",
        priority: "high",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("issues", defaultIssues);
  }

  // Initialize RFIs
  if (getCollection("rfis").length === 0) {
    const defaultRFIs = [
      {
        id: "rfi-1",
        _id: "rfi-1",
        title: "Foundation Specifications",
        description: "Need clarification on foundation depth requirements",
        status: "pending",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("rfis", defaultRFIs);
  }

  // Initialize submittals
  if (getCollection("submittals").length === 0) {
    const defaultSubmittals = [
      {
        id: "sub-1",
        _id: "sub-1",
        title: "Panel Specifications",
        description: "Solar panel technical specifications",
        status: "approved",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("submittals", defaultSubmittals);
  }

  // Initialize change requests
  if (getCollection("changerequests").length === 0) {
    const defaultChangeRequests = [
      {
        id: "cr-1",
        _id: "cr-1",
        title: "Additional Panels",
        description: "Request to add 50 more panels to the installation",
        status: "pending",
        impact: "budget",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("changerequests", defaultChangeRequests);
  }

  // Initialize meetings
  if (getCollection("meetings").length === 0) {
    const defaultMeetings = [
      {
        id: "meet-1",
        _id: "meet-1",
        title: "Weekly Standup",
        date: "2024-02-12",
        time: "09:00 AM",
        attendees: ["user-1", "user-2", "user-3"],
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("meetings", defaultMeetings);
  }

  // Initialize activities
  if (getCollection("activities").length === 0) {
    const defaultActivities = [
      {
        id: "act-1",
        _id: "act-1",
        type: "task_completed",
        description: "Site Survey completed",
        userId: "user-2",
        projectId: "proj-1",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("activities", defaultActivities);
  }

  // Initialize subscriptions
  if (getCollection("subscriptions").length === 0) {
    const defaultSubscriptions = [
      {
        id: "sub-1",
        _id: "sub-1",
        name: "Enterprise Plan",
        price: 499,
        features: ["Unlimited projects", "Advanced analytics", "Priority support"],
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];
    saveCollection("subscriptions", defaultSubscriptions);
  }

  // Initialize permissions
  if (getCollection("permissions").length === 0) {
    const defaultPermissions = [
      { id: "perm-1", _id: "perm-1", name: "read", description: "Read access", createdAt: new Date().toISOString() },
      { id: "perm-2", _id: "perm-2", name: "write", description: "Write access", createdAt: new Date().toISOString() },
      { id: "perm-3", _id: "perm-3", name: "delete", description: "Delete access", createdAt: new Date().toISOString() },
      { id: "perm-4", _id: "perm-4", name: "admin", description: "Admin access", createdAt: new Date().toISOString() },
    ];
    saveCollection("permissions", defaultPermissions);
  }
};

export default {
  getCollection,
  saveCollection,
  getById,
  createItem,
  updateItem,
  deleteItem,
  initializeDefaultData,
  generateId,
};

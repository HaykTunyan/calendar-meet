# Angular Appointment Calendar

## 📌 Overview
This project is an **Angular-based Appointment Calendar** with **drag-and-drop functionality** and **IndexedDB** storage. It allows users to **schedule, edit, and delete appointments** while saving data locally.

## 🚀 Features
- **Drag & Drop Appointments** 📌
- **Persistent Storage with IndexedDB** 💾
- **Material UI for a Modern Design** 🎨
- **Real-time Updates Without Page Refresh** 🔄
- **Monthly Calendar View** 📅
- **Edit & Delete Appointments** ✏️🗑️

## 🛠️ Tech Stack
- **Angular 19**
- **Angular Material** (UI components)
- **CDK DragDrop** (for drag-and-drop functionality)
- **IndexedDB** (for local storage)
- **RxJS BehaviorSubject** (for real-time data updates)

## 📂 Folder Structure
```
📦 appointment-calendar
├── 📂 src
│   ├── 📂 app
│   │   ├── 📂 components
│   │   │   ├── 📂 calendar        # Calendar View Component
│   │   │   ├── 📂 appointment-form # Appointment Form Component
│   │   ├── 📂 services
│   │   │   ├── indexed-db.service.ts # IndexedDB Service
│   │   ├── 📂 styles
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
├── angular.json
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/angular-appointment-calendar.git
cd angular-appointment-calendar
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Run the Application
```sh
ng serve
```
Then open **http://localhost:4200/** in your browser. 🚀

## 🎯 Usage Guide

### 📅 Creating an Appointment
1. Click on a **date** to open the appointment form.
2. Enter the **title, time, and description**.
3. Click **Save** to add the appointment.

### 📌 Drag & Drop
- **Rearrange appointments** within the same list.
- **Move appointments** to a different date by dragging them.

### ✏️ Editing an Appointment
- Click the **Edit (✏️) button** next to an appointment.
- Modify details and click **Save**.

### 🗑️ Deleting an Appointment
- Click the **Delete (🗑️) button** to remove an appointment.

## 📦 Dependencies
```json
"dependencies": {
  "@angular/core": "^19.0.0",
  "@angular/material": "^19.0.0",
  "@angular/cdk": "^19.0.0",
  "idb": "^7.1.1",
  "rxjs": "^7.8.0"
}
```

## 🛠️ Known Issues & Fixes
### ❌ IndexedDB Not Updating Automatically?
✅ Fixed by using `ChangeDetectorRef` and `BehaviorSubject` for real-time updates.

### ❌ IndexedDB Not Available in Some Browsers?
✅ Ensure **local storage is enabled** in your browser settings.

## 🤝 Contributing
Feel free to fork this repo and submit pull requests! 🎉

## 📜 License
MIT License. Free to use and modify. ✅


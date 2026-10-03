// src/pages/ItemManager.jsx
import { useState } from "react";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";
import ItemDetail from "./ItemDetail";

export default function ItemManager() {
  // state view bisa berupa: 'list', 'create', 'edit', 'detail'
  const [view, setView] = useState("list");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const navigateTo = (viewName, itemId = null) => {
    setSelectedItemId(itemId);
    setView(viewName);
  };

  return (
    <div className="w-full h-full">
      {view === "list" && (
        <ItemList 
          onCreate={() => navigateTo("create")} 
          onEdit={(id) => navigateTo("edit", id)}
          onDetail={(id) => navigateTo("detail", id)}
        />
      )}
      {view === "create" && (
        <ItemForm 
          onBack={() => navigateTo("list")} 
          onSuccess={() => navigateTo("list")} 
        />
      )}
      {view === "edit" && (
        <ItemForm 
          itemId={selectedItemId} 
          onBack={() => navigateTo("list")} 
          onSuccess={() => navigateTo("list")} 
        />
      )}
      {view === "detail" && (
        <ItemDetail 
          itemId={selectedItemId} 
          onBack={() => navigateTo("list")}
          onEdit={(id) => navigateTo("edit", id)}
        />
      )}
    </div>
  );
}
import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi, subcategoryApi } from "../lib/api";


function SubCategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });


  const queryClient = useQueryClient();

  // fetch some data
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories"],
    queryFn: subcategoryApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categorys"],
    queryFn: categoryApi.getAll,
  });

  // creating, update, deleting
  const createSubCategoryMutation = useMutation({
    mutationFn: subcategoryApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: subcategoryApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });

const deleteSubCategoryMutation = useMutation({
  mutationFn: subcategoryApi.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["subcategories"] });
  },
});
  const closeModal = () => {
    // reset the state
    setShowModal(false);
    setEditingSubCategory(null);
    setFormData({
      name: "",
      category: "",
    });
  };

const handleEdit = (subcategory) => {
  setEditingSubCategory(subcategory);
  setFormData({
    name: subcategory.name ?? "",
    category: subcategory.category ?? "",
  });
  setShowModal(true);
};

  const handleSubmit = (e) => {
    e.preventDefault();


    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);

    if (editingSubCategory) {
      updateSubCategoryMutation.mutate({ id: editingSubCategory._id, formData: formDataToSend });
    } else {
      createSubCategoryMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sub Categories</h1>
          <p className="text-base-content/70 mt-1">Manage your Sub Categories inventory</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Sub Category
        </button>
      </div>

      {/* sub category grid */}
      <div className="grid grid-cols-1 gap-4">
        {subcategories?.map((subcategory) => {
          

          return (
            <div key={subcategory._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-6">
                  <div className="avatar">
                    <div className="w-20 rounded-xl">
                      <img src={subcategory.category?.images?.[0]} alt={subcategory.name} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title">{subcategory.name}</h3>
                        <p className="text-base-content/70 text-sm">{subcategory.category?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEdit(subcategory)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost text-error"
                      onClick={() => deleteSubCategoryMutation.mutate(subcategory._id)}
                    >
                      {deleteSubCategoryMutation.isPending ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <Trash2Icon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT SUB CATEGORY MODAL */}

      <input type="checkbox" className="modal-toggle" checked={showModal} onChange={() => {}} readOnly />

      <div className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl">
              {editingSubCategory ? "Edit Sub category" : "Add New Sub Category"}
            </h3>

            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Sub Category</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter subcategory name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                    <option value="">Select category</option>
                    {categories.map((cat)=>(
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            
           

            <div className="modal-action">
              <button
                type="button"
                onClick={closeModal}
                className="btn"
                disabled={createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending}
              >
                {createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : editingSubCategory ? (
                  "Update Sub category"
                ) : (
                  "Add Sub Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubCategoriesPage;
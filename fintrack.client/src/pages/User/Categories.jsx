import { useEffect, useState } from 'react';
import { Spin, Skeleton } from 'antd';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import categoryService from '../../services/category.service';
import { useNavigate } from 'react-router-dom';

// Component quản lý danh sách categories với tính năng CRUD và filter
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deletingCategoryType, setDeletingCategoryType] = useState(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const nav = useNavigate()
  const { toast } = useToast();

  // Load danh sách categories khi component mount
  useEffect(()=> {
    const getCategory = async () => {
      try {
        setIsLoading(true);
        const response = await categoryService.getAllCategory()

        if(response.status !== 200) {
          toast({
            variant: "destructive",
            title: "Fail to get category",
            description: "Please make sure your information is correct.",
          });
          return;
        }

        setCategories(response.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading categories",
          description: "Something went wrong while loading categories.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getCategory()
  },[])

  const filteredCategories = categories.filter(category => {
    // Apply type filter
    if (filterType !== 'all' && category.type !== filterType) {
      return false;
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      return category.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Thêm category mới với validation
  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty.",
      });
      return;
    }

    // Check if category name already exists
    if (categories.some(cat => cat.categoryName.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A category with this name already exists.",
      });
      return;
    }

    try {
      setIsCreating(true);
      const newCategory = {
        categoryName: newCategoryName,
        type: newCategoryType,
        isDefault: false,
      };

      const response = await categoryService.createCategory(newCategory)

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Fail to create new category",
          description: "Please make sure your information is correct.",
        });
        return;
      }
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setNewCategoryType('expense');
      setIsAddDialogOpen(false);

      toast({
        title: "Category added",
        description: `The category "${newCategoryName}" has been created.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating category",
        description: "Something went wrong while creating the category.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Điều hướng đến trang transactions theo category
  const handleClickOnCategoryCard = (categoryName) => {
    nav(`/transactions?categoryName=${categoryName}`)
  }

  // Mở dialog chỉnh sửa category
  const handleEditCategory = (categoryName, type) => {
    const category = categories.find(c => c.categoryName === categoryName && c.type === type);
    if (category) {
      setEditingCategory(category);
      setNewCategoryName(category.categoryName);
      setNewCategoryType(category.type);
      setIsEditDialogOpen(true);
    }
  };

  // Cập nhật thông tin category
  const handleUpdateCategory = async () => {
    if (newCategoryName.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty.",
      });
      return;
    }

    // Check if category name already exists (excluding the current category)
    if (categories.some(cat =>
      !(cat.categoryName === editingCategory.categoryName && cat.type === editingCategory.type) &&
      cat.categoryName.toLowerCase() === newCategoryName.toLowerCase() &&
      cat.type === editingCategory.type
    )) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A category with this name already exists.",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const updateData = {
        categoryName: newCategoryName,
        type: editingCategory.type, // Keep original type
        isDefault: editingCategory.isDefault
      };

      const response = await categoryService.updateCategory(
        editingCategory.categoryName,
        editingCategory.type,
        updateData
      );

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Fail to update category",
          description: "Please make sure your information is correct.",
        });
        return;
      }

      // Update local state
      setCategories(prev =>
        prev.map(c =>
          c.categoryName === editingCategory.categoryName && c.type === editingCategory.type ? {
            ...c,
            categoryName: newCategoryName
          } : c
        )
      );

      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryType('expense');

      toast({
        title: "Category updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating category",
        description: "Something went wrong while updating the category.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = (categoryName, type) => {
    const category = categories.find(c => (c.categoryName === categoryName && c.type == type)) ;
    if (category?.isDefault) {
      toast({
        variant: "destructive",
        title: "Cannot delete default category",
        description: "Default categories cannot be deleted.",
      });
      return;
    }

    setDeletingCategory(categoryName);
    setDeletingCategoryType(type)
  };

  const confirmDelete = async () => {
    if (deletingCategory && deletingCategoryType) {
      try {
        setIsDeleting(true);
        setCategories(prev => prev.filter(c => !(c.categoryName == deletingCategory && c.type == deletingCategoryType)));

        const response = await categoryService.deleteCategory(deletingCategory,deletingCategoryType)

        if (response.status !== 200) {
          toast({
            variant: "destructive",
            title: "Fail to delete",
            description: "Please make sure your information is correct.",
          });
          return;
        }

        toast({
          title: "Category deleted",
          description: "The category has been removed.",
        });

        setDeletingCategory(null);
        setDeletingCategoryType(null);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error deleting category",
          description: "Something went wrong while deleting the category.",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-800" htmlFor="categoryName">Category Name</label>
                <Input
                  id="categoryName"
                  placeholder="e.g. Groceries"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-800">Category Type</label>
                <Select value={newCategoryType} onValueChange={setNewCategoryType}>
                  <SelectTrigger className="border-primary-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleAddCategory}
              className="w-full bg-primary-400 hover:bg-primary-500 text-white"
              disabled={isCreating}
            >
              {isCreating ? <Spin size="small" /> : 'Add Category'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-primary-200">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="income">Income Categories</SelectItem>
              <SelectItem value="expense">Expense Categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="pb-2">
                <Skeleton active paragraph={{ rows: 1 }} />
              </CardHeader>
              <CardContent>
                <Skeleton active paragraph={{ rows: 1 }} />
              </CardContent>
              <CardFooter className="pt-0">
                <Skeleton.Button active size="small" />
              </CardFooter>
            </Card>
          ))
        ) : (
          <>
            {filteredCategories.map(category => (
              <Card onClick={()=>handleClickOnCategoryCard(category.categoryName)} key={`${category.categoryName}-${category.type}`} className={`${category.isDefault ? 'border-primary-200' : 'border-primary-400/30'} bg-white`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center text-primary-900">
                    {category.categoryName}
                    <span className={`text-xs px-2 py-1 rounded ${category.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                      {category.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-primary-600">
                    {category.totalSpentAmount ? `Total amount spent: ${category.totalSpentAmount}` : ''}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex space-x-2 ml-auto">
                    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category.categoryName, category.type);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.categoryName, category.type);
                      }}
                      disabled={category.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {!isLoading && filteredCategories.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-xl text-primary-600">No categories found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-800" htmlFor="editCategoryName">Category Name</label>
              <Input
                id="editCategoryName"
                placeholder="e.g. Groceries"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={editingCategory?.isDefault}
              />
              {editingCategory?.isDefault && (
                <p className="text-xs text-primary-600">Default categories cannot be renamed.</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-800">Category Type</label>
              <Select
                value={newCategoryType}
                onValueChange={setNewCategoryType}
                disabled={true}
              >
                <SelectTrigger className="border-primary-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-primary-600">Category type cannot be changed.</p>
            </div>
          </div>
          <Button
            onClick={handleUpdateCategory}
            className="w-full bg-primary-400 hover:bg-primary-500 text-white cursor-pointer"
            disabled={editingCategory?.isDefault || isUpdating}
          >
            {isUpdating ? <Spin size="small" /> : 'Update Category'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This will not delete any transactions associated with this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-compleprimary-500 hover:bg-compleprimary-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Spin size="small" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
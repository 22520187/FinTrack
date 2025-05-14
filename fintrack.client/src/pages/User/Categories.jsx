import { useState } from 'react';
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

// Mock data
const defaultCategories = [
  { id: '1', name: 'Food', type: 'expense', isDefault: true },
  { id: '2', name: 'Transport', type: 'expense', isDefault: true },
  { id: '3', name: 'Housing', type: 'expense', isDefault: true },
  { id: '4', name: 'Entertainment', type: 'expense', isDefault: true },
  { id: '5', name: 'Shopping', type: 'expense', isDefault: true },
  { id: '6', name: 'Utilities', type: 'expense', isDefault: true },
  { id: '7', name: 'Health', type: 'expense', isDefault: true },
  { id: '8', name: 'Salary', type: 'income', isDefault: true },
  { id: '9', name: 'Freelance', type: 'income', isDefault: true },
  { id: '10', name: 'Gift', type: 'income', isDefault: true },
  { id: '11', name: 'Investment', type: 'income', isDefault: true },
  { id: '12', name: 'Gym', type: 'expense', isDefault: false },
  { id: '13', name: 'Pets', type: 'expense', isDefault: false },
  { id: '14', name: 'Bonus', type: 'income', isDefault: false },
];

const Categories = () => {
  const [categories, setCategories] = useState(defaultCategories);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();
  
  const filteredCategories = categories.filter(category => {
    // Apply type filter
    if (filterType !== 'all' && category.type !== filterType) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      return category.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty.",
      });
      return;
    }
    
    // Check if category name already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A category with this name already exists.",
      });
      return;
    }
    
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      type: newCategoryType,
      isDefault: false,
    };
    
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryType('expense');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Category added",
      description: `The category "${newCategoryName}" has been created.`,
    });
  };
  
  const handleEditCategory = (id) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setEditingCategory(category);
      setNewCategoryName(category.name);
      setNewCategoryType(category.type);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdateCategory = () => {
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
      cat.id !== editingCategory.id && 
      cat.name.toLowerCase() === newCategoryName.toLowerCase()
    )) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A category with this name already exists.",
      });
      return;
    }
    
    setCategories(prev => 
      prev.map(c => c.id === editingCategory.id ? {
        ...c,
        name: newCategoryName,
        type: newCategoryType
      } : c)
    );
    
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    
    toast({
      title: "Category updated",
      description: "Your changes have been saved.",
    });
  };
  
  const handleDeleteCategory = (id) => {
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) {
      toast({
        variant: "destructive",
        title: "Cannot delete default category",
        description: "Default categories cannot be deleted.",
      });
      return;
    }
    
    setDeletingId(id);
  };
  
  const confirmDelete = () => {
    if (deletingId) {
      setCategories(prev => prev.filter(c => c.id !== deletingId));
      
      toast({
        title: "Category deleted",
        description: "The category has been removed.",
      });
      
      setDeletingId(null);
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
                <label className="text-sm font-medium text-primary-800 dark:text-primary-200" htmlFor="categoryName">Category Name</label>
                <Input
                  id="categoryName"
                  placeholder="e.g. Groceries"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-800 dark:text-primary-200">Category Type</label>
                <Select value={newCategoryType} onValueChange={setNewCategoryType}>
                  <SelectTrigger className="border-primary-200 dark:border-primary-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddCategory} className="w-full bg-primary-400 hover:bg-primary-500 text-white">Add Category</Button>
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
            <SelectTrigger className="border-primary-200 dark:border-primary-700">
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
        {filteredCategories.map(category => (
          <Card key={category.id} className={`${category.isDefault ? 'border-primary-200' : 'border-primary-400/30'} bg-white dark:bg-card-dark`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center text-primary-900 dark:text-primary-100">
                {category.name}
                <span className={`text-xs px-2 py-1 rounded ${
                  category.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {category.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-primary-600 dark:text-primary-300">
                {category.isDefault ? 'Default Category' : 'Custom Category'}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex space-x-2 ml-auto">
                <Button className= "cursor-pointer" variant="ghost" size="icon" onClick={() => handleEditCategory(category.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  className= "cursor-pointer"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={category.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {filteredCategories.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-xl text-primary-600 dark:text-primary-300">No categories found</p>
          </div>
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
              <label className="text-sm font-medium text-primary-800 dark:text-primary-200" htmlFor="editCategoryName">Category Name</label>
              <Input
                id="editCategoryName"
                placeholder="e.g. Groceries"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={editingCategory?.isDefault}
              />
              {editingCategory?.isDefault && (
                <p className="text-xs text-primary-600 dark:text-primary-300">Default categories cannot be renamed.</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-800 dark:text-primary-200">Category Type</label>
              <Select 
                value={newCategoryType} 
                onValueChange={setNewCategoryType}
                disabled={editingCategory?.isDefault}
              >
                <SelectTrigger className="border-primary-200 dark:border-primary-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              {editingCategory?.isDefault && (
                <p className="text-xs text-primary-600 dark:text-primary-300">Default category types cannot be changed.</p>
              )}
            </div>
          </div>
          <Button 
            onClick={handleUpdateCategory} 
            className="w-full bg-primary-400 hover:bg-primary-500 text-white cursor-pointer" 
            disabled={editingCategory?.isDefault}
          >
            Update Category
          </Button>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This will not delete any transactions associated with this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-compleprimary-500 hover:bg-compleprimary-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
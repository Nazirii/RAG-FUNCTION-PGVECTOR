import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { menuAPI } from '../api/api';

function MenuManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    min_price: '',
    max_price: '',
    max_cal: '',
    page: 1,
    per_page: 12,
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    calories: '',
    price: '',
    ingredients: '',
    description: '',
    image_url: '',
    is_available: true,
    preparation_time: '',
    spicy_level: 'none',
    allergens: '',
    nutritional_info: { protein: '', carbs: '', fat: '', fiber: '' },
  });

  // Debounced search - 250ms
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, q: value, page: 1 }));
    }, 250),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput, debouncedSearch]);

  // Fetch menus
  const { data, isLoading, error } = useQuery({
    queryKey: ['menus', filters],
    queryFn: () => menuAPI.getAll(filters).then(res => res.data),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: menuAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      resetForm();
      alert('✅ Menu berhasil dibuat!');
    },
    onError: (error) => {
      alert('❌ Error: ' + (error.response?.data?.message || 'Gagal membuat menu'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => menuAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      resetForm();
      alert('✅ Menu berhasil diupdate!');
    },
    onError: (error) => {
      alert('❌ Error: ' + (error.response?.data?.message || 'Gagal update menu'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: menuAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      alert('✅ Menu berhasil dihapus!');
    },
    onError: (error) => {
      alert('❌ Error: ' + (error.response?.data?.message || 'Gagal hapus menu'));
    },
  });

  const resetForm = () => {
    setFormData({
      name: '', category: 'food', calories: '', price: '', ingredients: '',
      description: '', image_url: '', is_available: true, preparation_time: '',
      spicy_level: 'none', allergens: '',
      nutritional_info: { protein: '', carbs: '', fat: '', fiber: '' },
    });
    setEditingMenu(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      calories: parseInt(formData.calories) || 0,
      price: parseFloat(formData.price) || 0,
      preparation_time: parseInt(formData.preparation_time) || 0,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
      allergens: formData.allergens.split(',').map(a => a.trim()).filter(Boolean),
      nutritional_info: {
        protein: parseInt(formData.nutritional_info.protein) || 0,
        carbs: parseInt(formData.nutritional_info.carbs) || 0,
        fat: parseInt(formData.nutritional_info.fat) || 0,
        fiber: parseInt(formData.nutritional_info.fiber) || 0,
      },
    };

    if (editingMenu) {
      updateMutation.mutate({ id: editingMenu.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      category: menu.category,
      calories: menu.calories,
      price: menu.price,
      ingredients: menu.ingredients?.join(', ') || '',
      description: menu.description,
      image_url: menu.image_url || '',
      is_available: menu.is_available,
      preparation_time: menu.preparation_time,
      spicy_level: menu.spicy_level,
      allergens: menu.allergens?.join(', ') || '',
      nutritional_info: menu.nutritional_info || { protein: '', carbs: '', fat: '', fiber: '' },
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  const categories = [
    { id: 'food', label: 'Food', icon: '🍔', color: 'from-orange-400 to-orange-600' },
    { id: 'drinks', label: 'Drinks', icon: '🥤', color: 'from-blue-400 to-blue-600' },
    { id: 'dessert', label: 'Dessert', icon: '🍰', color: 'from-pink-400 to-pink-600' },
    { id: 'appetizer', label: 'Appetizer', icon: '🥗', color: 'from-green-400 to-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📋 Menu Management</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
              showForm 
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
            }`}
          >
            {showForm ? '❌ Tutup Form' : '➕ Tambah Menu Baru'}
          </button>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Kategori</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => setFilters({ ...filters, category: '', page: 1 })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all transform hover:scale-105 ${
                filters.category === ''
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-sm font-semibold">All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.id, page: 1 })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all transform hover:scale-105 ${
                  filters.category === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-semibold">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="🔍 Cari menu..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <input
            type="number"
            placeholder="Min Harga"
            value={filters.min_price}
            onChange={(e) => setFilters({ ...filters, min_price: e.target.value, page: 1 })}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
          <input
            type="number"
            placeholder="Max Harga"
            value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value, page: 1 })}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Form Create/Edit */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingMenu ? '✏️ Edit Menu' : '➕ Tambah Menu Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Menu *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="food">Food</option>
                  <option value="drinks">Drinks</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kalori *</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waktu (menit)</label>
                <input
                  type="number"
                  value={formData.preparation_time}
                  onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level Pedas</label>
                <select
                  value={formData.spicy_level}
                  onChange={(e) => setFormData({ ...formData, spicy_level: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="hot">Hot</option>
                  <option value="extra_hot">Extra Hot</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="rice, chicken, egg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergens (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="peanuts, dairy, gluten"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Informasi Nutrisi</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['protein', 'carbs', 'fat', 'fiber'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field} (g)</label>
                    <input
                      type="number"
                      value={formData.nutritional_info[field]}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritional_info: { ...formData.nutritional_info, [field]: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="is_available" className="ml-2 text-sm font-medium text-gray-700">Tersedia</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {editingMenu ? '💾 Update Menu' : '➕ Tambah Menu'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading & Error States */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading menus...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          ❌ Error: {error.message}
        </div>
      )}

      {/* Menu Grid */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data?.map((menu) => (
              <div key={menu.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:scale-105">
                {/* Menu Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center p-6">
                  {menu.image_url ? (
                    <img 
                      src={menu.image_url} 
                      alt={menu.name}
                      className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl shadow-lg ring-4 ring-white">
                      {menu.category === 'food' ? '🍔' : menu.category === 'drinks' ? '🥤' : menu.category === 'dessert' ? '🍰' : '🥗'}
                    </div>
                  )}
                  {!menu.is_available && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Habis
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full">
                      {menu.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{menu.name}</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-3">
                    {formatPrice(menu.price)}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">🔥 {menu.calories} kcal</span>
                    <span className="flex items-center gap-1">⏱️ {menu.preparation_time} min</span>
                    {menu.spicy_level !== 'none' && (
                      <span className="flex items-center gap-1">🌶️ {menu.spicy_level}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {menu.description}
                  </p>
                  {menu.ingredients && menu.ingredients.length > 0 && (
                    <p className="text-xs text-gray-500 mb-4">
                      <strong>Ingredients:</strong> {menu.ingredients.slice(0, 3).join(', ')}
                      {menu.ingredients.length > 3 && '...'}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(menu)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(menu.id)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 transform hover:scale-105"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                ← Previous
              </button>
              <span className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-2 border-orange-500 rounded-xl font-semibold shadow-md">
                Page {data.pagination.page} of {data.pagination.total_pages}
              </span>
              <button
                disabled={filters.page >= data.pagination.total_pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MenuManager;

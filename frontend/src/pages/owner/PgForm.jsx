import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePg, useCreatePg, useUpdatePg } from '../../hooks/usePgs';
import Input from '../../components/Input';
import Button from '../../components/Button';

const EMPTY_FORM = {
  name: '', description: '', address: '', city: '', state: '', pincode: '',
  genderType: 'UNISEX', rentStartingFrom: '',
  amenities: { wifi: false, food: false, ac: false, parking: false, washingMachine: false, gym: false, cctv: false, powerBackup: false },
};

export default function PgForm() {
  const { id } = useParams(); // present only when editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: existingPg } = usePg(isEditing ? id : undefined);
  const createPg = useCreatePg();
  const updatePg = useUpdatePg();

  const [form, setForm] = useState(EMPTY_FORM);

  // Populate the form once existing data has loaded, in edit mode.
  useEffect(() => {
    if (existingPg) {
      setForm({
        ...existingPg,
        amenities: existingPg.amenities || EMPTY_FORM.amenities,
      });
    }
  }, [existingPg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, rentStartingFrom: Number(form.rentStartingFrom) };

    if (isEditing) {
      updatePg.mutate({ id, data: payload }, { onSuccess: () => navigate('/owner/dashboard') });
    } else {
      createPg.mutate(payload, { onSuccess: () => navigate('/owner/dashboard') });
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit PG' : 'Add New PG'}</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <Input label="PG Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />
        </div>

        <Input label="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <div className="grid grid-cols-3 gap-3">
          <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <Input label="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gender Type</label>
            <select
              value={form.genderType}
              onChange={(e) => setForm({ ...form, genderType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </div>
          <Input
            label="Starting Rent (₹/mo)"
            type="number"
            required
            value={form.rentStartingFrom}
            onChange={(e) => setForm({ ...form, rentStartingFrom: e.target.value })}
          />
        </div>

        <label className="block text-sm font-medium mb-2">Amenities</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {Object.keys(form.amenities).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={form.amenities[key]}
                onChange={(e) => setForm({ ...form, amenities: { ...form.amenities, [key]: e.target.checked } })}
              />
              {key}
            </label>
          ))}
        </div>

        <Button type="submit" isLoading={createPg.isPending || updatePg.isPending}>
          {isEditing ? 'Save Changes' : 'Create Listing'}
        </Button>
      </form>

      {isEditing && (
        <p className="text-sm text-gray-500 mt-4">
          Manage rooms for this PG from its detail page after saving.
        </p>
      )}
    </div>
  );
}

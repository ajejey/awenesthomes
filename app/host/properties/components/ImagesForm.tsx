"use client";

import { useState, useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { PhotoIcon, XMarkIcon, CheckCircleIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { uploadPropertyImage, deletePropertyImage } from "../actions/upload";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// Define image data type
type ImageData = {
  url: string;
  publicId: string;
  caption?: string;
  isPrimary?: boolean;
};

// Sortable image component
function SortableImage({ image, index, onDelete, onSetPrimary, images, setValue }: { 
  image: ImageData; 
  index: number; 
  onDelete: (index: number) => void; 
  onSetPrimary: (index: number) => void; 
  images: ImageData[];
  setValue: (name: string, value: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.url });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
    >
      <div 
        className="cursor-move h-40 relative" 
        {...attributes} 
        {...listeners}
      >
        <Image 
          src={image.url} 
          alt={image.caption || 'Property image'} 
          fill 
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
        {image.isPrimary && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
            Primary
          </div>
        )}
      </div>
      
      <div className="p-2 flex justify-between items-center bg-gray-50">
        <input 
          type="text" 
          placeholder="Add caption" 
          className="text-sm w-full bg-transparent border-none focus:ring-0 focus:outline-none" 
          value={image.caption || ''}
          onChange={(e) => {
            const newCaption = e.target.value;
            const imageIndex = index;
            const updatedImages = [...images];
            updatedImages[imageIndex] = { ...updatedImages[imageIndex], caption: newCaption };
            setValue('images', updatedImages);
          }}
        />
      </div>
      
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!image.isPrimary && (
          <button 
            type="button" 
            onClick={() => onSetPrimary(index)}
            className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
            title="Set as primary image"
          >
            <CheckCircleIcon className="w-4 h-4" />
          </button>
        )}
        <button 
          type="button" 
          onClick={() => onDelete(index)}
          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
          title="Delete image"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ImagesForm() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const images = watch('images') || [] as ImageData[];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle file selection
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Convert file to base64 string
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('Failed to read file');
          }
          
          const base64String = event.target.result as string;
          console.log('Base64 string length:', base64String.length);
          console.log('Base64 string starts with:', base64String.substring(0, 50) + '...');
          
          const formData = new FormData();
          formData.append('image', base64String);
          
          console.log('FormData created, sending to server...');
          const result = await uploadPropertyImage(formData);
          console.log('Upload result:', result);
          
          if (result.success && result.url && result.publicId) {
            const newImage: ImageData = {
              url: result.url,
              publicId: result.publicId,
              caption: '',
              isPrimary: images.length === 0 // Make first image primary by default
            };
            
            const updatedImages = [...images, newImage];
            setValue('images', updatedImages);
          } else {
            setUploadError(result.error || 'Failed to upload image');
          }
        } catch (error) {
          console.error('Error processing image:', error);
          setUploadError('Failed to process image. Please try again.');
        } finally {
          setIsUploading(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.onerror = () => {
        setUploadError('Failed to read file. Please try again.');
        setIsUploading(false);
      };
      
      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling file:', error);
      setUploadError('Failed to handle file. Please try again.');
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images, setValue]);
  
  // Function to delete an image
  const handleDeleteImage = useCallback(async (index: number) => {
    const imageToDelete = images[index];
    if (!imageToDelete) return;
    
    try {
      const result = await deletePropertyImage(imageToDelete.publicId);
      
      if (result.success) {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        
        // If we deleted the primary image, make the first image primary
        if (imageToDelete.isPrimary && updatedImages.length > 0) {
          updatedImages[0] = { ...updatedImages[0], isPrimary: true };
        }
        
        setValue('images', updatedImages);
      } else {
        console.error('Failed to delete image:', result.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [images, setValue]);
  
  // Function to set an image as primary
  const handleSetPrimaryImage = useCallback((index: number) => {
    const updatedImages = images.map((img: ImageData, i: number) => ({
      ...img,
      isPrimary: i === index
    }));
    
    setValue('images', updatedImages);
  }, [images, setValue]);
  
  // Function to handle drag end (reordering)
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img: ImageData) => img.url === active.id);
      const newIndex = images.findIndex((img: ImageData) => img.url === over.id);
      
      const updatedImages = [...images];
      const [movedItem] = updatedImages.splice(oldIndex, 1);
      updatedImages.splice(newIndex, 0, movedItem);
      
      setValue('images', updatedImages);
    }
  }, [images, setValue]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Property Images</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Upload high-quality images of your property. The first image will be the main image shown in search results.
        </p>
        
        {errors.images && (
          <p className="mt-2 text-sm text-red-600">
            {errors.images.message?.toString() || 'Please add at least one image'}
          </p>
        )}
      </div>
      
      <div>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload an image</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, WEBP up to 10MB</p>
            
            {isUploading && (
              <div className="mt-4 flex items-center justify-center">
                <ArrowUpTrayIcon className="animate-bounce h-5 w-5 text-indigo-600 mr-2" />
                <p className="text-sm text-indigo-600">Uploading...</p>
              </div>
            )}
            
            {uploadError && (
              <div className="mt-4 text-sm text-red-600">
                {uploadError}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Images</h3>
          <p className="text-xs text-gray-500 mb-4">Drag to reorder. Set one image as primary.</p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={images.map((img: ImageData) => img.url)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image: ImageData, index: number) => (
                  <SortableImage
                    key={image.url}
                    image={image}
                    index={index}
                    onDelete={handleDeleteImage}
                    onSetPrimary={handleSetPrimaryImage}
                    images={images}
                    setValue={setValue}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {images.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Photo Tips</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use high-quality, well-lit photos</li>
                  <li>Include images of all rooms and amenities</li>
                  <li>Take photos during daylight for natural lighting</li>
                  <li>Use landscape orientation for better display</li>
                  <li>Set your best photo as the primary image</li>
                  <li>Avoid using filters or excessive editing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

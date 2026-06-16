from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies.db import get_db
from ..dependencies.models import MenuItem, MenuCategory
from ..dependencies.schemas import MenuItemCreate, MenuItemResponse, MenuCategoryCreate, MenuCategoryResponse

router = APIRouter()

@router.get("/")
def get_menu_items(
    category: Optional[str] = Query(None, description="Category name to filter by"),
    search: Optional[str] = Query(None, description="Search term for menu item name or description"),
    db: Session = Depends(get_db)
):
    """Retrieve menu items with optional category filtering and search queries."""
    query = db.query(MenuItem)
    
    if category and category != "All":
        query = query.join(MenuCategory).filter(MenuCategory.name.ilike(category))
        
    if search:
        query = query.filter(
            (MenuItem.name.ilike(f"%{search}%")) | 
            (MenuItem.description.ilike(f"%{search}%"))
        )
        
    items = query.all()
    
    results = []
    for item in items:
        cat_name = item.category.name if item.category else "Uncategorized"
        results.append({
            "id": item.id,
            "category_id": item.category_id,
            "category_name": cat_name,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "image_url": item.image_url,
            "is_featured": item.is_featured,
            "is_spicy": item.is_spicy,
            "is_organic": item.is_organic,
            "allergens": item.allergens,
            "is_available": item.is_available
        })
    return {"items": results}

@router.get("/categories", response_model=List[MenuCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Retrieve all menu categories."""
    categories = db.query(MenuCategory).all()
    return categories

@router.post("/", response_model=MenuItemResponse, status_code=201)
def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    """Create a new menu item (Admin)."""
    # Check if category exists
    category = db.query(MenuCategory).filter(MenuCategory.id == item.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category_id")

    db_item = MenuItem(
        category_id=item.category_id,
        name=item.name,
        description=item.description,
        price=item.price,
        image_url=item.image_url,
        is_featured=item.is_featured,
        is_spicy=item.is_spicy,
        is_organic=item.is_organic,
        allergens=item.allergens,
        is_available=item.is_available
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Format response compatibility
    db_item.category_name = category.name
    return db_item

@router.post("/category", response_model=MenuCategoryResponse, status_code=201)
def create_category(category: MenuCategoryCreate, db: Session = Depends(get_db)):
    """Create a new menu category (Admin)."""
    # Check if exists
    db_cat = db.query(MenuCategory).filter(MenuCategory.slug == category.slug).first()
    if db_cat:
        raise HTTPException(status_code=400, detail="Category slug already exists")

    db_cat = MenuCategory(
        name=category.name,
        slug=category.slug
    )
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat
